import { HardwareInfo, ServerInfo } from '@dash/common';
import { exec as cexec } from 'child_process';
import * as fs from 'fs';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

const normalizeGpuBrand = (brand: string) => {
  return brand ? brand.replace(/(corporation)/gi, '').trim() : undefined;
};

const normalizeGpuName = (name: string) => {
  return name ? name.replace(/(nvidia|amd|intel)/gi, '').trim() : undefined;
};

const normalizeGpuModel = (model: string) => {
  return model ? model.replace(/\[.*\]/gi, '').trim() : undefined;
};

const STATIC_INFO = new BehaviorSubject<HardwareInfo>({
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
  gpu: {
    layout: [],
  },
});

const loadOsInfo = async (): Promise<void> => {
  const info = await si.osInfo();

  STATIC_INFO.next({
    ...STATIC_INFO.getValue(),
    os: {
      arch: info.arch,
      distro: info.distro,
      kernel: info.kernel,
      platform: info.platform,
      release:
        info.release === 'unknown' ? info.build || 'unknown' : info.release,
      uptime: 0,
    },
  });
};

const loadCpuInfo = async (): Promise<void> => {
  const info = await si.cpu();

  STATIC_INFO.next({
    ...STATIC_INFO.getValue(),
    cpu: {
      brand: info.manufacturer,
      model: normalizeCpuModel(info.brand),
      cores: info.physicalCores,
      threads: info.cores,
      frequency: info.speed,
    },
  });
};

const loadRamInfo = async (): Promise<void> => {
  const [info, layout] = await Promise.all([si.mem(), si.memLayout()]);

  STATIC_INFO.next({
    ...STATIC_INFO.getValue(),
    ram: {
      size: info.total,
      layout: layout.map(({ manufacturer, type, clockSpeed }) => ({
        brand: manufacturer,
        type: type,
        frequency: clockSpeed ?? undefined,
      })),
    },
  });
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

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      storage: {
        layout: blockLayout,
      },
    });
  } else {
    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      storage: {
        layout: disks.map(({ size, type, vendor }) => ({
          brand: vendor,
          size,
          type,
        })),
      },
    });
  }
};

const loadNetworkInfo = async (): Promise<void> => {
  if (NET_INTERFACE !== 'unknown') {
    const NET_PATH = `/internal_mnt/host_sys/class/net/${NET_INTERFACE}`;
    const isWireless = fs.existsSync(`${NET_PATH}/wireless`);
    const isBridge = fs.existsSync(`${NET_PATH}/bridge`);
    const isBond = fs.existsSync(`${NET_PATH}/bonding`);
    const isTap = fs.existsSync(`${NET_PATH}/tun_flags`);

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      network: {
        ...STATIC_INFO.getValue().network,
        type: isWireless
          ? 'Wireless'
          : isBridge
          ? 'Bridge'
          : isBond
          ? 'Bond'
          : isTap
          ? 'TAP'
          : 'Wired',
      },
    });

    // Wireless networks have no fixed Interface speed
    if (!isWireless) {
      const { stdout } = await exec(`cat ${NET_PATH}/speed`);
      const numValue = Number(stdout.trim());

      STATIC_INFO.next({
        ...STATIC_INFO.getValue(),
        network: {
          ...STATIC_INFO.getValue().network,
          interfaceSpeed: isNaN(numValue) || numValue === -1 ? 0 : numValue,
        },
      });
    }
  } else {
    const networkInfo = await si.networkInterfaces();
    //@ts-ignore
    const defaultNet = networkInfo.find(net => net.default)!;

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      network: {
        ...STATIC_INFO.getValue().network,
        type: defaultNet.type,
        interfaceSpeed: defaultNet.speed,
      },
    });
  }
};

const loadGpuInfo = async (): Promise<void> => {
  const info = await si.graphics();

  STATIC_INFO.next({
    ...STATIC_INFO.getValue(),
    gpu: {
      layout: info.controllers.map(controller => ({
        brand: normalizeGpuBrand(controller.vendor),
        model:
          normalizeGpuName(controller.name) ??
          normalizeGpuModel(controller.model),
        memory: controller.memoryTotal ?? controller.vram ?? 0,
      })),
    },
  });
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

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      network: {
        ...STATIC_INFO.getValue().network,
        speedDown:
          json.download.bandwidth * 8 ??
          STATIC_INFO.getValue().network.speedDown,
        speedUp:
          json.upload.bandwidth * 8 ?? STATIC_INFO.getValue().network.speedUp,
        publicIp:
          json.interface.externalIp ?? STATIC_INFO.getValue().network.publicIp,
      },
    });
  } else if (await commandExists('speedtest-cli')) {
    usedRunner = 'speedtest-cli';
    const { stdout } = await exec('speedtest-cli --json');
    const json = JSON.parse(stdout);

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      network: {
        ...STATIC_INFO.getValue().network,
        speedDown: json.download ?? STATIC_INFO.getValue().network.speedDown,
        speedUp: json.upload ?? STATIC_INFO.getValue().network.speedUp,
        publicIp: json.client.ip ?? STATIC_INFO.getValue().network.publicIp,
      },
    });
  } else {
    usedRunner = 'universal';
    const universalSpeedtest = new UniversalSpeedtest({
      measureUpload: true,
      downloadUnit: SpeedUnits.bps,
      uploadUnit: SpeedUnits.bps,
    });

    const speed = await universalSpeedtest.runSpeedtestNet();

    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      network: {
        ...STATIC_INFO.getValue().network,
        speedDown:
          speed.downloadSpeed ?? STATIC_INFO.getValue().network.speedDown,
        speedUp: speed.uploadSpeed ?? STATIC_INFO.getValue().network.speedUp,
        publicIp: speed.client.ip ?? STATIC_INFO.getValue().network.publicIp,
      },
    });
  }

  return usedRunner;
};

const promIf = (condition: boolean, func: () => Promise<any>): Promise<any> => {
  return condition ? func() : Promise.resolve(null);
};

export const loadStaticServerInfo = async (): Promise<void> => {
  await Promise.allSettled([
    promIf(CONFIG.widget_list.includes('os'), loadOsInfo),
    promIf(CONFIG.widget_list.includes('cpu'), loadCpuInfo),
    promIf(CONFIG.widget_list.includes('ram'), loadRamInfo),
    promIf(CONFIG.widget_list.includes('storage'), loadStorageInfo),
    promIf(CONFIG.widget_list.includes('network'), loadNetworkInfo),
    promIf(CONFIG.widget_list.includes('gpu'), loadGpuInfo),
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
    ...STATIC_INFO.getValue(),
    os: {
      ...STATIC_INFO.getValue().os,
      uptime: +si.time().uptime,
    },
    config: CONFIG,
  };
};

export const getStaticServerInfoObs = (): Observable<ServerInfo> => {
  return STATIC_INFO.pipe(
    map(info => ({
      ...info,
      os: {
        ...info.os,
        uptime: +si.time().uptime,
      },
      config: CONFIG,
    }))
  );
};
