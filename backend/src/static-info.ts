import {
  CpuInfo,
  HardwareInfo,
  OsInfo,
  RamInfo,
  StorageInfo,
} from 'dashdot-shared';
import si from 'systeminformation';
import util from 'util';

let INFO_SAVE: HardwareInfo | null = null;

export const getStaticServerInfo = async (): Promise<HardwareInfo> => {
  if (!INFO_SAVE) {
    const [osInfo, cpuInfo, memInfo, memLayout, diskLayout] = await Promise.all(
      [si.osInfo(), si.cpu(), si.mem(), si.memLayout(), si.diskLayout()]
    );

    const os: Omit<OsInfo, 'uptime'> = {
      arch: osInfo.arch,
      distro: osInfo.distro,
      kernel: osInfo.kernel,
      platform: osInfo.platform,
      release: osInfo.release,
    };

    const cpu: CpuInfo = {
      manufacturer: cpuInfo.manufacturer,
      brand: cpuInfo.brand,
      speed: cpuInfo.speed,
      cores: cpuInfo.physicalCores,
      threads: cpuInfo.cores,
    };

    const ram: RamInfo = {
      total: memInfo.total,
      layout: memLayout.map(({ manufacturer, type, clockSpeed }) => ({
        manufacturer: manufacturer,
        type: type,
        clockSpeed: clockSpeed ?? undefined,
      })),
    };

    const storage: StorageInfo = {
      layout: diskLayout.map(({ size, type, name }) => ({
        size,
        type,
        name,
      })),
    };

    INFO_SAVE = {
      //@ts-ignore
      os,
      cpu,
      ram,
      storage,
    };

    console.log(
      'Static Server Info Gathered: ',
      util.inspect(INFO_SAVE, { showHidden: false, depth: null, colors: true })
    );
  }

  return {
    ...INFO_SAVE!,
    os: {
      ...INFO_SAVE!.os,
      uptime: +si.time().uptime,
    },
  };
};
