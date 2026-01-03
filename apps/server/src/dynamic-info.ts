import cron from 'node-cron';
import { interval, mergeMap, Observable, ReplaySubject, Subject } from 'rxjs';
import { inspect } from 'util';
import { CONFIG } from './config';
import getCpuInfo from './data/cpu';
import getGpuInfo from './data/gpu';
import getNetworkInfo from './data/network';
import getRamInfo from './data/ram';
import getStorageInfo from './data/storage';
import { loadInfo } from './static-info';

const createBufferedInterval = <R>(
  name: string,
  enabled: boolean,
  bufferSize: number,
  intervalMs: number,
  factory: () => Promise<R>,
): Observable<R> => {
  const buffer = new ReplaySubject<R>(bufferSize);

  if (enabled) {
    // Instantly load first value
    factory()
      .then((value) => {
        console.log(
          `First measurement [${name}]:`,
          inspect(value, {
            showHidden: false,
            depth: null,
            colors: true,
          }),
        );

        buffer.next(value);
      })
      .catch((err) => buffer.error(err));

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
    getCpuInfo.dynamic,
  );

  const ramObs = createBufferedInterval(
    'RAM',
    CONFIG.widget_list.includes('ram'),
    CONFIG.ram_shown_datapoints,
    CONFIG.ram_poll_interval,
    getRamInfo.dynamic,
  );

  const storageObs = createBufferedInterval(
    'Storage',
    CONFIG.widget_list.includes('storage'),
    1,
    CONFIG.storage_poll_interval,
    getStorageInfo.dynamic,
  );

  const networkObs = createBufferedInterval(
    'Network',
    CONFIG.widget_list.includes('network'),
    CONFIG.network_shown_datapoints,
    CONFIG.network_poll_interval,
    getNetworkInfo.dynamic,
  );

  const gpuObs = createBufferedInterval(
    'GPU',
    CONFIG.widget_list.includes('gpu'),
    CONFIG.gpu_shown_datapoints,
    CONFIG.gpu_poll_interval,
    getGpuInfo.dynamic,
  );

  let speedTestObs = new Observable();

  if (CONFIG.widget_list.includes('network')) {
    if (CONFIG.speed_test_interval_cron) {
      const subject = new Subject();

      cron.schedule(CONFIG.speed_test_interval_cron, async () => {
        subject.next(await loadInfo('network', getNetworkInfo.speedTest, true));
      });

      speedTestObs = subject.asObservable();
    } else {
      speedTestObs = interval(CONFIG.speed_test_interval * 60 * 1000).pipe(
        mergeMap(
          async () => await loadInfo('network', getNetworkInfo.speedTest, true),
        ),
      );
    }
  }

  return {
    cpu: cpuObs,
    ram: ramObs,
    storage: storageObs,
    network: networkObs,
    gpu: gpuObs,
    speedTest: speedTestObs,
  };
};
