import { execSync, spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import type { GpuInfo, GpuLoad } from '@dashdot/common';
import * as si from 'systeminformation';
import { CONFIG } from '../config';

const normalizeGpuBrand = (brand: string) => {
  return brand ? brand.replace(/(corporation)/gi, '').trim() : undefined;
};

const normalizeGpuName = (name: string) => {
  return name ? name.replace(/(nvidia|amd|intel)/gi, '').trim() : undefined;
};

const normalizeGpuModel = (model: string) => {
  return model ? model.replace(/\[.*\]/gi, '').trim() : undefined;
};

const isValidController = (
  controller: si.Systeminformation.GraphicsControllerData,
) => {
  const blacklist = ['monitor'];
  const model = controller.model.toLowerCase();
  return blacklist.every((w) => !model.includes(w));
};

const isInFilter = (
  controller: si.Systeminformation.GraphicsControllerData,
) => {
  const isInBrandFilter =
    CONFIG.gpu_brand_filter.length === 0 ||
    CONFIG.gpu_brand_filter.includes(
      normalizeGpuBrand(controller.vendor) ?? '',
    );
  const isInModelFilter =
    CONFIG.gpu_model_filter.length === 0 ||
    CONFIG.gpu_model_filter.includes(
      normalizeGpuName(controller.name ?? '') ??
        normalizeGpuModel(controller.model) ??
        '',
    );
  return isInBrandFilter && isInModelFilter;
};

type IntelDrmCard = {
  device: string; // e.g. /dev/dri/card0
  pciSlot: string; // e.g. 0000:00:02.0
};

const findIntelDrmCards = (): IntelDrmCard[] => {
  try {
    const cards = readdirSync('/dev/dri').filter((e) => /^card\d+$/.test(e));
    return cards.sort().flatMap((e) => {
      try {
        const { rdev } = statSync(`/dev/dri/${e}`);
        const major = (rdev >> 8) & 0xfff;
        const minor = rdev & 0xff;
        const sysPath = realpathSync(`/sys/dev/char/${major}:${minor}`);
        const devicePath = path.resolve(sysPath, '../..');
        const vendor = readFileSync(`${devicePath}/vendor`, 'utf8').trim();
        if (vendor !== '0x8086') return [];
        const pciSlot = path.basename(devicePath);
        return [{ device: `/dev/dri/${e}`, pciSlot }];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
};

const getIntelGpuInfoFromLspci = (
  pciSlot: string,
): { vendor: string; model: string } | null => {
  try {
    const output = execSync(`lspci -vmm -s "${pciSlot}"`, {
      timeout: 3000,
    }).toString();
    const fields: Record<string, string> = {};
    for (const line of output.trim().split('\n')) {
      const match = line.match(/^(\w+):\s+(.+)$/);
      if (match) fields[match[1]] = match[2].trim();
    }
    const vendor = fields['Vendor']?.replace(/corporation/gi, '').trim();
    const model = fields['Device']?.trim();
    if (vendor && model) return { vendor, model };
  } catch {
    // lspci not available or slot not found — caller falls back to si data
  }
  return null;
};

type IntelGpuResult = {
  load: number;
  memory: number;
  engines: Record<string, number>;
};

type IntelGpuState = {
  process: ChildProcess | null;
  latestResult: IntelGpuResult | null;
  buffer: string;
  restarting: boolean;
};

const intelGpuStates = new Map<string, IntelGpuState>();

const extractResultFromObj = (obj: any): IntelGpuResult | null => {
  if (!obj?.engines) return null;
  const engines: Record<string, number> = {};
  const busyValues: number[] = [];
  for (const [name, val] of Object.entries(
    obj.engines as Record<string, any>,
  )) {
    const busy = typeof val.busy === 'number' ? val.busy : 0;
    engines[name] = busy;
    busyValues.push(busy);
  }
  if (busyValues.length === 0) return null;
  return { load: Math.max(...busyValues), memory: 0, engines };
};

const processBuffer = (state: IntelGpuState): void => {
  let searchFrom = 0;
  while (true) {
    let depth = 0;
    let start = -1;
    let foundEnd = -1;
    for (let i = searchFrom; i < state.buffer.length; i++) {
      if (state.buffer[i] === '{') {
        if (depth === 0) start = i;
        depth++;
      } else if (state.buffer[i] === '}') {
        depth--;
        if (depth === 0 && start !== -1) {
          foundEnd = i;
          break;
        }
      }
    }
    if (foundEnd === -1) break;

    try {
      const obj = JSON.parse(state.buffer.slice(start, foundEnd + 1));
      const result = extractResultFromObj(obj);
      if (result) state.latestResult = result;
    } catch {
      // malformed object, skip
    }

    searchFrom = foundEnd + 1;
  }

  // Keep only unprocessed data; guard against unbounded growth
  state.buffer = state.buffer.slice(searchFrom);
  if (state.buffer.length > 50_000) {
    state.buffer = '';
  }
};

const startIntelGpuTopProcess = (device: string): void => {
  const state = intelGpuStates.get(device);
  if (!state || state.restarting) return;

  const proc = spawn(
    'intel_gpu_top',
    ['-J', '-s', '500', '-d', `drm:${device}`, '-o', '-'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  state.process = proc;
  state.buffer = '';

  proc.stdout!.on('data', (chunk: Buffer) => {
    state.buffer += chunk.toString();
    processBuffer(state);
  });

  proc.on('error', (err) => {
    console.warn(`[GPU] intel_gpu_top process error for ${device}:`, err);
  });

  proc.on('exit', (code, signal) => {
    state.process = null;
    // Intentional kill (e.g. SIGTERM on server shutdown) — do not restart
    if (signal === 'SIGTERM' || signal === 'SIGKILL') return;
    console.warn(
      `[GPU] intel_gpu_top exited for ${device} (code ${code}), restarting in 5s`,
    );
    state.restarting = true;
    setTimeout(() => {
      state.restarting = false;
      startIntelGpuTopProcess(device);
    }, 5000);
  });
};

// Cache Intel cards since hardware doesn't change at runtime
let cachedIntelCards: IntelDrmCard[] | null = null;

const getIntelCards = (): IntelDrmCard[] => {
  if (cachedIntelCards !== null) return cachedIntelCards;

  cachedIntelCards = findIntelDrmCards();
  for (const card of cachedIntelCards) {
    intelGpuStates.set(card.device, {
      process: null,
      latestResult: null,
      buffer: '',
      restarting: false,
    });
    startIntelGpuTopProcess(card.device);
  }

  // Clean up child processes on server exit
  process.once('exit', () => {
    for (const state of intelGpuStates.values()) {
      state.process?.kill('SIGTERM');
    }
  });

  return cachedIntelCards;
};

const getIntelGpuTopLoad = (
  device: string,
): { load: number; memory: number; engines?: Record<string, number> } => {
  return intelGpuStates.get(device)?.latestResult ?? { load: 0, memory: 0 };
};

export default {
  dynamic: async (): Promise<GpuLoad> => {
    const gpuInfo = await si.graphics();
    const controllers = gpuInfo.controllers
      .filter(isValidController)
      .filter(isInFilter);

    const hasIntel = controllers.some((c) =>
      (c.vendor ?? '').toLowerCase().includes('intel'),
    );

    const intelCards = hasIntel ? getIntelCards() : [];

    let intelIdx = 0;
    return {
      layout: controllers.map((controller) => {
        if ((controller.vendor ?? '').toLowerCase().includes('intel')) {
          return getIntelGpuTopLoad(intelCards[intelIdx++]?.device ?? '');
        }
        return {
          load: controller.utilizationGpu ?? 0,
          memory: controller.utilizationMemory ?? 0,
        };
      }),
    };
  },
  static: async (): Promise<GpuInfo> => {
    const gpuInfo = await si.graphics();
    const controllers = gpuInfo.controllers
      .filter(isValidController)
      .filter(isInFilter);

    const hasIntel = controllers.some((c) =>
      (c.vendor ?? '').toLowerCase().includes('intel'),
    );

    // Eagerly initialise Intel cards so intel_gpu_top starts as early as possible
    const intelCards = hasIntel ? getIntelCards() : [];
    let intelIdx = 0;

    return {
      layout: controllers.map((controller) => {
        if ((controller.vendor ?? '').toLowerCase().includes('intel')) {
          const card = intelCards[intelIdx++];
          const lspciInfo = card
            ? getIntelGpuInfoFromLspci(card.pciSlot)
            : null;
          return {
            brand: lspciInfo?.vendor ?? normalizeGpuBrand(controller.vendor) ?? '',
            model:
              lspciInfo?.model ??
              normalizeGpuName(controller.name ?? '') ??
              normalizeGpuModel(controller.model) ??
              '',
            memory: controller.memoryTotal ?? controller.vram ?? 0,
          };
        }
        return {
          brand: normalizeGpuBrand(controller.vendor) ?? '',
          model:
            normalizeGpuName(controller.name ?? '') ??
            normalizeGpuModel(controller.model) ??
            '',
          memory: controller.memoryTotal ?? controller.vram ?? 0,
        };
      }),
    };
  },
};
