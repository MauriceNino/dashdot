import {
  CpuInfo,
  HardwareInfo,
  NetworkInfo,
  OsInfo,
  RamInfo,
  ServerInfo,
  StorageInfo,
} from '@dash/common';
import { exec as cexec } from 'child_process';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { SpeedUnits, UniversalSpeedtest } from 'universal-speedtest';
import { promisify } from 'util';
import { CONFIG } from './config';
import { NET_INTERFACE } from './setup-networking';

const exec = promisify(cexec);

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

    const network: NetworkInfo = {
      interfaceSpeed: 0,
      speedDown: 0,
      speedUp: 0,
      type: '',
      publicIp: '',
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

export const gatherStaticNetworkInfo = async () => {
  if (NET_INTERFACE !== 'unknown') {
    const NET_PATH = `/internal_mnt/host_sys/class/net/${NET_INTERFACE}`;
    const isWireless = fs.existsSync(`${NET_PATH}/wireless`);
    const isBridge = fs.existsSync(`${NET_PATH}/bridge`);
    const isBond = fs.existsSync(`${NET_PATH}/bonding`);
    const isTap = fs.existsSync(`${NET_PATH}/tun_flags`);

    INFO_SAVE!.network.type = isWireless
      ? 'Wireless'
      : isBridge
      ? 'Bridge'
      : isBond
      ? 'Bond'
      : isTap
      ? 'TAP'
      : 'Wired';

    // Wireless networks have no fixed Interface speed
    if (!isWireless) {
      const { stdout } = await exec(`cat ${NET_PATH}/speed`);
      const numValue = Number(stdout.trim());

      if (isNaN(numValue) || numValue === -1) {
        INFO_SAVE!.network.interfaceSpeed = 0;
      } else {
        INFO_SAVE!.network.interfaceSpeed = numValue * 1000 * 1000;
      }
    }
  } else {
    const networkInfo = await si.networkInterfaces();
    //@ts-ignore
    const defaultNet = networkInfo.find(net => net.default)!;

    INFO_SAVE!.network.type = defaultNet.type;
    INFO_SAVE!.network.interfaceSpeed = defaultNet.speed;
  }

  const { stdout, stderr } = await exec('which speedtest');

  if (stderr === '' && stdout.trim() !== '') {
    const { stdout } = await exec('speedtest --json');
    const json = JSON.parse(stdout);

    INFO_SAVE!.network.speedDown =
      json.download ?? INFO_SAVE!.network.speedDown;
    INFO_SAVE!.network.speedUp = json.upload ?? INFO_SAVE!.network.speedUp;
    INFO_SAVE!.network.publicIp = json.client.ip ?? INFO_SAVE!.network.publicIp;

    return json;
  } else {
    const universalSpeedtest = new UniversalSpeedtest({
      measureUpload: true,
      downloadUnit: SpeedUnits.bps,
      uploadUnit: SpeedUnits.bps,
    });

    const speed = await universalSpeedtest.runSpeedtestNet();

    INFO_SAVE!.network.speedDown =
      speed.downloadSpeed ?? INFO_SAVE!.network.speedDown;
    INFO_SAVE!.network.speedUp =
      speed.uploadSpeed ?? INFO_SAVE!.network.speedUp;
    INFO_SAVE!.network.publicIp =
      speed.client.ip ?? INFO_SAVE!.network.publicIp;

    return speed;
  }
};
