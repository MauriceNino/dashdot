import { CpuLoad, NetworkLoad, RamLoad, StorageLoad } from '@dash/common';
import { exec as cexec } from 'child_process';
import { interval, mergeMap, Observable, ReplaySubject } from 'rxjs';
import * as si from 'systeminformation';
import { inspect, promisify } from 'util';
import { CONFIG } from './config';
import { NET_INTERFACE } from './setup-networking';
import { getStaticServerInfo, runSpeedTest } from './static-info';

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

export const getDynamicServerInfo = () => {
  const cpuObs = createBufferedInterval(
    'CPU',
    CONFIG.cpu_shown_datapoints,
    CONFIG.cpu_poll_interval,
    async (): Promise<CpuLoad> => {
      const staticInfo = await getStaticServerInfo();
      const loads = (await si.currentLoad()).cpus;

      let temps: si.Systeminformation.CpuTemperatureData['cores'] = [];
      let mainTemp = 0;
      if (CONFIG.enable_cpu_temps) {
        const siTemps = await si.cpuTemperature();
        const threadsPerCore = staticInfo.cpu.threads / staticInfo.cpu.cores;
        temps = siTemps.cores.flatMap(temp => Array(threadsPerCore).fill(temp));
        mainTemp = siTemps.main; // AVG temp of all cores, in case no per-core data is found
      }

      return loads.map(({ load }, i) => ({
        load,
        temp: temps[i] ?? mainTemp,
        core: i,
      }));
    }
  );

  const ramObs = createBufferedInterval(
    'RAM',
    CONFIG.ram_shown_datapoints,
    CONFIG.ram_poll_interval,
    async (): Promise<RamLoad> => {
      return (await si.mem()).active;
    }
  );

  const storageObs = createBufferedInterval(
    'Storage',
    1,
    CONFIG.storage_poll_interval,
    async (): Promise<StorageLoad> => {
      const sizes = await si.fsSize();

      const filtered = sizes.filter(
        ({ fs, mount }) => mount.startsWith('/mnt/host_') || fs === 'overlay'
      );

      return filtered.reduce((acc, { used }) => acc + used, 0);
    }
  );

  let [lastRx, lastTx] = [0, 0];

  const networkObs = createBufferedInterval(
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

  const speedTestObs = interval(CONFIG.speed_test_interval * 60 * 1000).pipe(
    mergeMap(async () => await runSpeedTest())
  );

  return {
    cpu: cpuObs,
    ram: ramObs,
    storage: storageObs,
    network: networkObs,
    speedTest: speedTestObs,
  };
};
