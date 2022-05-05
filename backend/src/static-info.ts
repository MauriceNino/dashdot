import {
  CpuInfo,
  HardwareInfo,
  OsInfo,
  RamInfo,
  ServerInfo,
  StorageInfo,
} from 'dashdot-shared';
import si from 'systeminformation';
import { CONFIG } from './config';

const normalizeCpuModel = (cpuModel: string) => {
  return cpuModel
    .replace(/Processor/g, '')
    .replace(/[A-Za-z0-9]*-Core/g, '')
    .trim();
};

let INFO_SAVE: HardwareInfo | null = null;

export const getStaticServerInfo = async (): Promise<ServerInfo> => {
  if (!INFO_SAVE) {
    const [osInfo, cpuInfo, memInfo, memLayout, diskLayout] = await Promise.all(
      [si.osInfo(), si.cpu(), si.mem(), si.memLayout(), si.diskLayout()]
    );

    const os: OsInfo = {
      arch: osInfo.arch,
      distro: osInfo.distro,
      kernel: osInfo.kernel,
      platform: osInfo.platform,
      release: osInfo.release,
      uptime: 0,
    };

    const cpu: CpuInfo = {
      brand: cpuInfo.manufacturer,
      model: normalizeCpuModel(cpuInfo.brand),
      cores: cpuInfo.physicalCores,
      threads: cpuInfo.cores,
      frequency: cpuInfo.speed,
    };

    const ram: RamInfo = {
      size: memInfo.total,
      layout: memLayout.map(({ manufacturer, type, clockSpeed }) => ({
        brand: manufacturer,
        type: type,
        frequency: clockSpeed ?? undefined,
      })),
    };

    const storage: StorageInfo = {
      layout: diskLayout.map(({ size, type, vendor }) => ({
        brand: vendor,
        size,
        type,
      })),
    };

    INFO_SAVE = {
      os,
      cpu,
      ram,
      storage,
    };
  }

  return {
    ...INFO_SAVE!,
    os: {
      ...INFO_SAVE!.os,
      uptime: +si.time().uptime,
    },
    config: CONFIG,
  };
};
