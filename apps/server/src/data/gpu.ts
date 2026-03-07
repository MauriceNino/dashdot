import { exec as execCb } from 'node:child_process';
import { readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import type { GpuInfo, GpuLoad } from '@dashdot/common';
import * as si from 'systeminformation';
import { CONFIG } from '../config';

const exec = promisify(execCb);

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
  const vendor = (controller.vendor ?? '').toLowerCase();
  // For Intel, only include discrete Arc GPUs
  if (vendor.includes('intel') && !model.includes('arc')) {
    return false;
  }
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

const findIntelArcDrmCards = (): string[] => {
  try {
    const cards = readdirSync('/dev/dri').filter((e) => /^card\d+$/.test(e));
    return cards
      .filter((e) => {
        try {
          const { rdev } = statSync(`/dev/dri/${e}`);
          const major = (rdev >> 8) & 0xff;
          const minor = rdev & 0xff;
          const sysPath = realpathSync(`/sys/dev/char/${major}:${minor}`);
          const devicePath = path.resolve(sysPath, '../..');
          const vendor = readFileSync(`${devicePath}/vendor`, 'utf8').trim();
          return vendor === '0x8086';
        } catch {
          return false;
        }
      })
      .sort()
      .map((e) => `/dev/dri/${e}`);
  } catch {
    return [];
  }
};

const parseIntelGpuTopCsv = (
  stdout: string,
): { load: number; memory: number; engines: Record<string, number> } | null => {
  const lines = stdout.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 2) return null;
  const headers = lines[0].split(',').map((h) => h.trim());
  // Find the last complete data row (process may be killed mid-write)
  let values: string[] | null = null;
  for (let i = lines.length - 1; i >= 1; i--) {
    const row = lines[i].split(',');
    if (row.length === headers.length) {
      values = row;
      break;
    }
  }
  if (!values) return null;
  const engines: Record<string, number> = {};
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].endsWith(' %')) {
      const name = headers[i].slice(0, -2).trim();
      const val = parseFloat(values[i]);
      engines[name] = isNaN(val) ? 0 : val;
    }
  }
  if (Object.keys(engines).length === 0) return null;
  const load = engines['RCS'] ?? 0;
  return { load, memory: 0, engines };
};

const getIntelGpuTopLoad = async (
  device: string,
): Promise<{ load: number; memory: number; engines?: Record<string, number> }> => {
  let stdout = '';
  try {
    const result = await exec(
      `intel_gpu_top -s 500 -d drm:${device}`,
      { timeout: 3000 },
    );
    stdout = result.stdout;
  } catch (err: any) {
    // Process killed by timeout (SIGTERM) — stdout may still have usable data
    if (err?.stdout) {
      stdout = err.stdout as string;
    } else {
      console.warn(`[GPU] intel_gpu_top failed for ${device}:`, err);
      return { load: 0, memory: 0 };
    }
  }

  if (!stdout.trim()) return { load: 0, memory: 0 };

  const result = parseIntelGpuTopCsv(stdout);
  if (result) return result;
  console.warn(`[GPU] intel_gpu_top: could not parse output for ${device}`);
  return { load: 0, memory: 0 };
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

    let intelCardData: Awaited<ReturnType<typeof getIntelGpuTopLoad>>[] = [];
    if (hasIntel) {
      const intelCards = findIntelArcDrmCards();
      intelCardData = await Promise.all(intelCards.map(getIntelGpuTopLoad));
    }

    let intelIdx = 0;
    return {
      layout: controllers.map((controller) => {
        if ((controller.vendor ?? '').toLowerCase().includes('intel')) {
          return intelCardData[intelIdx++] ?? { load: 0, memory: 0 };
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

    return {
      layout: gpuInfo.controllers
        .filter(isValidController)
        .filter(isInFilter)
        .map((controller) => ({
          brand: normalizeGpuBrand(controller.vendor) ?? '',
          model:
            normalizeGpuName(controller.name ?? '') ??
            normalizeGpuModel(controller.model) ??
            '',
          memory: controller.memoryTotal ?? controller.vram ?? 0,
        })),
    };
  },
};
