import { HardwareInfo, ServerInfo } from '@dash/common';
import { exec as cexec } from 'child_process';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { SpeedUnits, UniversalSpeedtest } from 'universal-speedtest';
import { inspect, promisify } from 'util';
import { CONFIG } from './config';
import { NET_INTERFACE } from './setup-networking';

const exec = promisify(cexec);

const normalizeCpuModel = (cpuModel: string) => {
  return cpuModel
    .replace(/Processor/g, '')
    .replace(/[A-Za-z0-9]*-Core/g, '')
    .trim();
};

const STATIC_INFO: HardwareInfo = {
  os: {
    arch: '',
    distro: '',
    kernel: '',
    platform: '',
    release: '',
    uptime: 0,
  },
  cpu: {
    brand: '',
    model: '',
    cores: 0,
    threads: 0,
    frequency: 0,
  },
  ram: {
    size: 0,
    layout: [],
  },
  storage: {
    layout: [],
  },
  network: {
    interfaceSpeed: 0,
    speedDown: 0,
    speedUp: 0,
    type: '',
    publicIp: '',
  },
};

const loadOsInfo = async (): Promise<void> => {
  const info = await si.osInfo();

  STATIC_INFO.os = {
    arch: info.arch,
    distro: info.distro,
    kernel: info.kernel,
    platform: info.platform,
    release:
      info.release === 'unknown' ? info.build || 'unknown' : info.release,
    uptime: 0,
  };
};

const loadCpuInfo = async (): Promise<void> => {
  const info = await si.cpu();

  STATIC_INFO.cpu = {
    brand: info.manufacturer,
    model: normalizeCpuModel(info.brand),
    cores: info.physicalCores,
    threads: info.cores,
    frequency: info.speed,
  };
};

const loadRamInfo = async (): Promise<void> => {
  const [info, layout] = await Promise.all([si.mem(), si.memLayout()]);

  STATIC_INFO.ram = {
    size: info.total,
    layout: layout.map(({ manufacturer, type, clockSpeed }) => ({
      brand: manufacturer,
      type: type,
      frequency: clockSpeed ?? undefined,
    })),
  };
};

const loadStorageInfo = async (): Promise<void> => {
  const [disks, blocks] = await Promise.all([
    si.diskLayout(),
    si.blockDevices(),
  ]);

  const raidMembers = blocks.filter(block => block.fsType.endsWith('_member'));
  const blockDisks = blocks.filter(block => block.type === 'disk');
  const blockParts = blocks.filter(block => block.type === 'part');

  if (raidMembers.length > 0) {
    const blockLayout = blockDisks
      .map(disk => {
        const diskRaidMem = raidMembers.filter(member =>
          member.name.startsWith(disk.name)
        );
        const diskParts = blockParts.filter(part =>
          part.name.startsWith(disk.name)
        );
        const nativeDisk = disks.find(d => d.name === disk.model);

        if (nativeDisk != null) {
          if (diskParts.some(part => part.mount != null && part.mount !== '')) {
            return {
              brand: nativeDisk.vendor,
              size: nativeDisk.size,
              type: nativeDisk.type,
            };
          } else if (diskRaidMem.length > 0) {
            const label = diskRaidMem[0].label.includes(':')
              ? diskRaidMem[0].label.split(':')[0]
              : diskRaidMem[0].label;
            return {
              brand: nativeDisk.vendor,
              size: nativeDisk.size,
              type: nativeDisk.type,
              raidGroup: label,
            };
          }
        }

        return undefined;
      })
      .filter(d => d != null);

    STATIC_INFO.storage = {
      layout: blockLayout,
    };
  } else {
    STATIC_INFO.storage = {
      layout: disks.map(({ size, type, vendor }) => ({
        brand: vendor,
        size,
        type,
      })),
    };
  }
};

const loadNetworkInfo = async (): Promise<void> => {
  if (NET_INTERFACE !== 'unknown') {
    const NET_PATH = `/internal_mnt/host_sys/class/net/${NET_INTERFACE}`;
    const isWireless = fs.existsSync(`${NET_PATH}/wireless`);
    const isBridge = fs.existsSync(`${NET_PATH}/bridge`);
    const isBond = fs.existsSync(`${NET_PATH}/bonding`);
    const isTap = fs.existsSync(`${NET_PATH}/tun_flags`);

    STATIC_INFO.network.type = isWireless
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

      STATIC_INFO.network.interfaceSpeed =
        isNaN(numValue) || numValue === -1 ? 0 : numValue;
    }
  } else {
    const networkInfo = await si.networkInterfaces();
    //@ts-ignore
    const defaultNet = networkInfo.find(net => net.default)!;

    STATIC_INFO.network.type = defaultNet.type;
    STATIC_INFO.network.interfaceSpeed = defaultNet.speed;
  }
};

const commandExists = async (command: string): Promise<boolean> => {
  try {
    const { stdout, stderr } = await exec(`which ${command}`);
    return stderr === '' && stdout.trim() !== '';
  } catch (e) {
    return false;
  }
};

export const runSpeedTest = async (): Promise<string> => {
  let usedRunner: string;
  if (CONFIG.accept_ookla_eula && (await commandExists('speedtest'))) {
    usedRunner = 'ookla';
    const { stdout } = await exec('speedtest -f json');
    const json = JSON.parse(stdout);

    STATIC_INFO.network.speedDown =
      json.download.bandwidth * 8 ?? STATIC_INFO.network.speedDown;
    STATIC_INFO.network.speedUp =
      json.upload.bandwidth * 8 ?? STATIC_INFO.network.speedUp;
    STATIC_INFO.network.publicIp =
      json.interface.externalIp ?? STATIC_INFO.network.publicIp;
  } else if (await commandExists('speedtest-cli')) {
    usedRunner = 'speedtest-cli';
    const { stdout } = await exec('speedtest-cli --json');
    const json = JSON.parse(stdout);

    STATIC_INFO.network.speedDown =
      json.download ?? STATIC_INFO.network.speedDown;
    STATIC_INFO.network.speedUp = json.upload ?? STATIC_INFO.network.speedUp;
    STATIC_INFO.network.publicIp =
      json.client.ip ?? STATIC_INFO.network.publicIp;
  } else {
    usedRunner = 'universal';
    const universalSpeedtest = new UniversalSpeedtest({
      measureUpload: true,
      downloadUnit: SpeedUnits.bps,
      uploadUnit: SpeedUnits.bps,
    });

    const speed = await universalSpeedtest.runSpeedtestNet();

    STATIC_INFO.network.speedDown =
      speed.downloadSpeed ?? STATIC_INFO.network.speedDown;
    STATIC_INFO.network.speedUp =
      speed.uploadSpeed ?? STATIC_INFO.network.speedUp;
    STATIC_INFO.network.publicIp =
      speed.client.ip ?? STATIC_INFO.network.publicIp;
  }

  return usedRunner;
};

export const loadStaticServerInfo = async (): Promise<void> => {
  await Promise.all([
    loadOsInfo(),
    loadCpuInfo(),
    loadRamInfo(),
    loadStorageInfo(),
    loadNetworkInfo(),
  ]);

  console.log(
    'Static Server Info:',
    inspect(getStaticServerInfo(), {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );
};

export const getStaticServerInfo = (): ServerInfo => {
  return {
    ...STATIC_INFO,
    os: {
      ...STATIC_INFO.os,
      uptime: +si.time().uptime,
    },
    config: CONFIG,
  };
};
