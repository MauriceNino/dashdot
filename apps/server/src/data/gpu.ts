import { exec as execCb } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
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

const findIntelDrmCards = (): string[] => {
  try {
    return readdirSync('/sys/class/drm')
      .filter((e) => /^card\d+$/.test(e))
      .filter((e) => {
        try {
          return (
            readFileSync(`/sys/class/drm/${e}/device/vendor`, 'utf8').trim() ===
            '0x8086'
          );
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

const getIntelGpuTopLoad = async (
  device: string,
): Promise<{ load: number; memory: number }> => {
  try {
    const { stdout } = await exec(
      `intel_gpu_top -J -s 100 -c 1 -d drm:${device}`,
      { timeout: 3000 },
    );
    const parsed = JSON.parse(stdout.trim());
    const entry = Array.isArray(parsed) ? parsed[0] : parsed;
    const engines: Record<string, { busy: number }> = entry?.engines ?? {};
    const renderKey = Object.keys(engines).find((k) =>
      k.startsWith('Render/3D'),
    );
    return { load: renderKey ? (engines[renderKey]?.busy ?? 0) : 0, memory: 0 };
  } catch {
    return { load: 0, memory: 0 };
  }
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

    let intelCardData: { load: number; memory: number }[] = [];
    if (hasIntel) {
      const intelCards = findIntelDrmCards();
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
