import { CpuLoad, NetworkLoad, RamLoad, StorageLoad } from '@dash/common';
import { exec as cexec } from 'child_process';
import { interval, mergeMap, Observable, ReplaySubject } from 'rxjs';
import * as si from 'systeminformation';
import { inspect, promisify } from 'util';
import { CONFIG } from './config';
import { NET_INTERFACE } from './setup-networking';
import { getStaticServerInfo } from './static-info';

const exec = promisify(cexec);

const createBufferedInterval = <R>(
  name: string,
  bufferSize: number,
  intervalMs: number,
  factory: () => Promise<R>
): Observable<R> => {
  const buffer = new ReplaySubject<R>(bufferSize);

  // Instantly load first value
  factory()
    .then(value => {
      console.log(
        `First measurement [${name}]:`,
        inspect(value, {
          showHidden: false,
          depth: null,
          colors: true,
        })
      );

      buffer.next(value);
    })
    .catch(err => buffer.error(err));

  // Load values every intervalMs
  interval(intervalMs).pipe(mergeMap(factory)).subscribe(buffer);

  return buffer.asObservable();
};

export const cpuObs = createBufferedInterval(
  'CPU',
  CONFIG.cpu_shown_datapoints,
  CONFIG.cpu_poll_interval,
  async (): Promise<CpuLoad> => {
    const staticInfo = await getStaticServerInfo();
    const loads = (await si.currentLoad()).cpus;

    let temps: si.Systeminformation.CpuTemperatureData['cores'] = [];
    if (CONFIG.enable_cpu_temps) {
      const threadsPerCore = staticInfo.cpu.threads / staticInfo.cpu.cores;
      temps = (await si.cpuTemperature()).cores.flatMap(temp =>
        Array(threadsPerCore).fill(temp)
      );
    }

    return loads.map(({ load }, i) => ({
      load,
      temp: temps[i],
      core: i,
    }));
  }
);

export const ramObs = createBufferedInterval(
  'RAM',
  CONFIG.ram_shown_datapoints,
  CONFIG.ram_poll_interval,
  async (): Promise<RamLoad> => {
    return (await si.mem()).active;
  }
);

export const storageObs = createBufferedInterval(
  'Storage',
  1,
  CONFIG.storage_poll_interval,
  async (): Promise<StorageLoad> => {
    const [disks, sizes] = await Promise.all([si.diskLayout(), si.fsSize()]);
    const devices = disks.map(({ device }) => device);

    const filtered = sizes.filter(
      ({ fs }) => devices.some(dev => fs.startsWith(dev)) || fs === 'overlay'
    );

    return filtered.reduce((acc, { used }) => acc + used, 0);
  }
);

let [lastRx, lastTx] = [0, 0];

export const netowrkObs = createBufferedInterval(
  'Network',
  CONFIG.network_shown_datapoints,
  CONFIG.network_poll_interval,
  async (): Promise<NetworkLoad> => {
    if (NET_INTERFACE !== 'unknown') {
      const { stdout } = await exec(
        `cat /internal_mnt/host_sys/class/net/${NET_INTERFACE}/statistics/rx_bytes;` +
          `cat /internal_mnt/host_sys/class/net/${NET_INTERFACE}/statistics/tx_bytes;`
      );
      const [rx, tx] = stdout.split('\n').map(Number);

      const result = {
        up: tx - lastTx,
        down: rx - lastRx,
      };

      lastRx = rx;
      lastTx = tx;

      return result;
    } else {
      const data = (await si.networkStats())[0];

      return {
        up: data.tx_sec,
        down: data.rx_sec,
      };
    }
  }
);
