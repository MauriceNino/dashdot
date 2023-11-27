import { GpuInfo, GpuLoad } from '@dash/common';
import * as si from 'systeminformation';

const normalizeGpuBrand = (brand: string) => {
  return brand ? brand.replace(/(corporation)/gi, '').trim() : undefined;
};

const normalizeGpuName = (name: string) => {
  return name ? name.replace(/(nvidia|amd|intel)/gi, '').trim() : undefined;
};

const normalizeGpuModel = (model: string) => {
  return model ? model.replace(/\[.*\]/gi, '').trim() : undefined;
};

const isValidController = (controller: si.Systeminformation.GraphicsControllerData) => {
  const blacklist = ['monitor'];
  const model = controller.model.toLowerCase();
  return blacklist.every( w => ! model.includes(w) );
};

export default {
  dynamic: async (): Promise<GpuLoad> => {
    const gpuInfo = await si.graphics();

    return {
      layout: gpuInfo.controllers.filter(isValidController).map(controller => ({
        load: controller.utilizationGpu ?? 0,
        memory: controller.utilizationMemory ?? 0,
      })),
    };
  },
  static: async (): Promise<GpuInfo> => {
    const gpuInfo = await si.graphics();

    return {
      layout: gpuInfo.controllers.filter(isValidController).map(controller => ({
        brand: normalizeGpuBrand(controller.vendor),
        model:
          normalizeGpuName(controller.name) ??
          normalizeGpuModel(controller.model),
        memory: controller.memoryTotal ?? controller.vram ?? 0,
      })),
    };
  },
};
