import {
  CpuLoad,
  GpuLoad,
  NetworkLoad,
  RamLoad,
  StorageLoad,
} from '@dash/common';
import { exec as cexec } from 'child_process';
import { interval, mergeMap, Observable, ReplaySubject } from 'rxjs';
import * as si from 'systeminformation';
import { inspect, promisify } from 'util';
import { CONFIG } from './config';
import { NET_INTERFACE_PATH } from './setup';
import { getStaticServerInfo, runSpeedTest } from './static-info';

const exec = promisify(cexec);

const createBufferedInterval = <R>(
  name: string,
  enabled: boolean,
  bufferSize: number,
  intervalMs: number,
  factory: () => Promise<R>
): Observable<R> => {
  const buffer = new ReplaySubject<R>(bufferSize);

  if (enabled) {
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
  }

  return new Observable();
};

export const getDynamicServerInfo = () => {
  const cpuObs = createBufferedInterval(
    'CPU',
    CONFIG.widget_list.includes('cpu'),
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
    CONFIG.widget_list.includes('ram'),
    CONFIG.ram_shown_datapoints,
    CONFIG.ram_poll_interval,
    async (): Promise<RamLoad> => {
      return (await si.mem()).active;
    }
  );

  const INVALID_FS_TYPES = [
    'cifs',
    '9p',
    'fuse.rclone',
    'fuse.mergerfs',
  ].concat(CONFIG.fs_type_filter);

  const storageObs = createBufferedInterval(
    'Storage',
    CONFIG.widget_list.includes('storage'),
    1,
    CONFIG.storage_poll_interval,
    async (): Promise<StorageLoad> => {
      const [layout, blocks, sizes] = await Promise.all([
        getStaticServerInfo(),
        si.blockDevices(),
        si.fsSize(),
      ]);

      const storageLayout = layout.storage.layout;
      const validMounts = sizes.filter(
        ({ mount, type }) =>
          mount.startsWith('/mnt/host/') && !INVALID_FS_TYPES.includes(type)
      );
      const hostMountUsed =
        sizes.filter(({ mount }) => mount === '/mnt/host' || mount === '/')[0]
          ?.used ?? 0;
      const validParts = blocks.filter(({ type }) => type === 'part');

      let hostFound = false;

      return {
        layout: storageLayout
          .map(({ device }) => {
            const deviceParts = validParts.filter(({ name }) =>
              name.startsWith(device)
            );
            const potentialHost =
              // drives that have all partitions unmounted
              deviceParts.every(
                ({ mount }) => mount == null || !mount.startsWith('/mnt/host/')
              ) ||
              // drives where one of the partitions is mounted to the root or /mnt/host/boot/
              deviceParts.some(
                ({ mount }) =>
                  mount === '/mnt/host' || mount.startsWith('/mnt/host/boot/')
              );

            // Apply all unclaimed partitions to the host disk
            if (potentialHost && !hostFound) {
              hostFound = true;
              const unclaimedSpace = validMounts
                .filter(
                  ({ mount }) => !validParts.some(part => part.mount === mount)
                )
                .reduce((acc, { used }) => acc + used, 0);

              return hostMountUsed + unclaimedSpace;
            }

            return potentialHost
              ? 0
              : deviceParts.reduce(
                  (acc, curr) =>
                    acc +
                    (validMounts.find(({ mount }) => curr.mount === mount)
                      ?.used ?? 0),
                  0
                );
          })
          .map(used => ({
            load: used,
          })),
      };
    }
  );

  let [lastRx, lastTx, lastTs] = [0, 0, 0];

  const networkObs = createBufferedInterval(
    'Network',
    CONFIG.widget_list.includes('network'),
    CONFIG.network_shown_datapoints,
    CONFIG.network_poll_interval,
    async (): Promise<NetworkLoad> => {
      if (NET_INTERFACE_PATH) {
        const { stdout } = await exec(
          `cat ${NET_INTERFACE_PATH}/statistics/rx_bytes;` +
            `cat ${NET_INTERFACE_PATH}/statistics/tx_bytes;`
        );
        const [rx, tx] = stdout.split('\n').map(Number);
        const thisTs = performance.now();
        const dividend = (thisTs - lastTs) / 1000;

        const result =
          lastTs === 0
            ? {
                up: 0,
                down: 0,
              }
            : {
                up: (tx - lastTx) / dividend,
                down: (rx - lastRx) / dividend,
              };

        lastRx = rx;
        lastTx = tx;
        lastTs = thisTs;

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

  const gpuObs = createBufferedInterval(
    'GPU',
    CONFIG.widget_list.includes('gpu'),
    CONFIG.gpu_shown_datapoints,
    CONFIG.gpu_poll_interval,
    async (): Promise<GpuLoad> => {
      const info = await si.graphics();

      return {
        layout: info.controllers.map(controller => ({
          load: controller.utilizationGpu ?? 0,
          memory: controller.utilizationMemory ?? 0,
        })),
      };
    }
  );

  const speedTestObs = CONFIG.widget_list.includes('network')
    ? interval(CONFIG.speed_test_interval * 60 * 1000).pipe(
        mergeMap(async () => await runSpeedTest())
      )
    : new Observable();

  return {
    cpu: cpuObs,
    ram: ramObs,
    storage: storageObs,
    network: networkObs,
    gpu: gpuObs,
    speedTest: speedTestObs,
  };
};
