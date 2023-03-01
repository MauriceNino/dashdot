import { HardwareInfo, ServerInfo } from '@dash/common';
import { BehaviorSubject, map, Observable } from 'rxjs';
import * as si from 'systeminformation';
import { inspect } from 'util';
import { CONFIG } from './config';
import getCpuInfo from './data/cpu';
import getGpuInfo from './data/gpu';
import getNetworkInfo from './data/network';
import getOsInfo from './data/os';
import getRamInfo from './data/ram';
import getStorageInfo from './data/storage';

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
  storage: [],
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

const promIf = (condition: boolean, func: () => Promise<any>): Promise<any> => {
  return condition ? func() : Promise.resolve(null);
};

export const loadInfo = <
  T extends 'os' | 'cpu' | 'storage' | 'ram' | 'network' | 'gpu',
  B extends boolean
>(
  info: T,
  loader: () => Promise<
    B extends true ? Partial<HardwareInfo[T]> : HardwareInfo[T]
  >,
  append: B
) => {
  return promIf(CONFIG.widget_list.includes(info), async () => {
    STATIC_INFO.next({
      ...STATIC_INFO.getValue(),
      [info]: append
        ? {
            ...STATIC_INFO.getValue()[info],
            ...(await loader()),
          }
        : await loader(),
    });
  });
};

export const loadStaticServerInfo = async (): Promise<void> => {
  await loadInfo('os', getOsInfo.static, false);
  await loadInfo('cpu', getCpuInfo.static, false);
  await loadInfo('ram', getRamInfo.static, false);
  await loadInfo('storage', getStorageInfo.static, false);
  await loadInfo('network', getNetworkInfo.static, true);
  await loadInfo('gpu', getGpuInfo.static, false);

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
