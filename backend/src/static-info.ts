import { exec as cexec } from 'child_process';
import {
  CpuInfo,
  HardwareInfo,
  NetworkInfo,
  OsInfo,
  RamInfo,
  ServerInfo,
  StorageInfo,
} from 'dashdot-shared';
import si from 'systeminformation';
import { SpeedUnits, UniversalSpeedtest } from 'universal-speedtest';
import util from 'util';
import { CONFIG } from './config';

const exec = util.promisify(cexec);

const normalizeCpuModel = (cpuModel: string) => {
  return cpuModel
    .replace(/Processor/g, '')
    .replace(/[A-Za-z0-9]*-Core/g, '')
    .trim();
};

let INFO_SAVE: HardwareInfo | null = null;

export const getStaticServerInfo = async (): Promise<ServerInfo> => {
  if (!INFO_SAVE) {
    const [osInfo, cpuInfo, memInfo, memLayout, diskLayout, networkInfo] =
      await Promise.all([
        si.osInfo(),
        si.cpu(),
        si.mem(),
        si.memLayout(),
        si.diskLayout(),
        si.networkInterfaces(),
      ]);

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

    //@ts-ignore
    const defaultNet = networkInfo.find(net => net.default)!;

    const network: NetworkInfo = {
      interfaceSpeed: defaultNet.speed,
      speedDown: 0,
      speedUp: 0,
      type: defaultNet.type,
    };

    INFO_SAVE = {
      os,
      cpu,
      ram,
      storage,
      network,
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

export const runSpeedTest = async () => {
  const { stdout, stderr } = await exec('which speedtest');

  if (stderr === '' && stdout.trim() !== '') {
    const { stdout } = await exec('speedtest --json');
    const json = JSON.parse(stdout);

    INFO_SAVE!.network.speedDown = json.download ?? 0;
    INFO_SAVE!.network.speedUp = json.upload ?? 0;

    return json;
  } else {
    const universalSpeedtest = new UniversalSpeedtest({
      measureUpload: true,
      downloadUnit: SpeedUnits.bps,
      uploadUnit: SpeedUnits.bps,
    });

    const speed = await universalSpeedtest.runSpeedtestNet();

    INFO_SAVE!.network.speedDown = speed.downloadSpeed ?? 0;
    INFO_SAVE!.network.speedUp = speed.uploadSpeed ?? 0;

    return speed;
  }
};
