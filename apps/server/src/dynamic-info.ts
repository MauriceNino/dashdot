import { inspect } from 'node:util';
import cron from 'node-cron';
import { debounceTime, interval, lastValueFrom, mergeMap, Observable, Observer, ReplaySubject, Subject, Subscribable, take, takeUntil, timeout, Unsubscribable } from 'rxjs';
import { CONFIG } from './config';
import getCpuInfo from './data/cpu';
import getGpuInfo from './data/gpu';
import getNetworkInfo from './data/network';
import getRamInfo from './data/ram';
import getStorageInfo from './data/storage';
import { loadInfo } from './static-info';

class LazyObservable<T> implements Subscribable<T> {

  private observers = [];

  private currentBuffer: Observable<T>;

  private stop = new Subject<any>();

  constructor(
    private name: string,
    private enabled: boolean,
    private runInBackground: boolean,
    private bufferSize: number,
    private intervalMs: number,
    private dataFactory: () => Promise<T>) {

    if (this.runInBackground) {
      this.tryStart();
    }

  }

  public subscribe(observer: Partial<Observer<T>> | ((value: T) => void)): Unsubscribable {
    if (!this.enabled) {
      return new LazyUnsubscribe();
    }
    this.tryStart();
    var subscription = this.currentBuffer.subscribe(observer);
    this.observers.push(observer);

    return new LazyUnsubscribe(() => {
      this.observers = this.observers.filter(x => x != observer);
      this.tryComplete();
      subscription.unsubscribe();
    });
  }

  public async getCurrentValue(): Promise<T | undefined> {
    try {
      if (this.currentBuffer) {
        return await lastValueFrom(this.currentBuffer.pipe(debounceTime(0), timeout(20), take(1)))
      }
      return this.dataFactory();;
    } catch (e) {
      return undefined;
    }
  };

  private tryComplete() {
    if (!this.runInBackground && this.observers.length == 0) {
      this.stop.next(1);
      this.stop = new Subject();
      this.currentBuffer = null;
    }
  }

  private tryStart() {
    if (this.currentBuffer == null) {
      this.currentBuffer = this.createBuffer();
    }
  }

  private createBuffer() {
    const buffer = new ReplaySubject<T>(this.bufferSize);

    this.dataFactory()
        console.log(
          `First measurement [${this.name}]:`,
          inspect(value, {
            showHidden: false,
            depth: null,
            colors: true,
          }),
        );
        buffer.next(value);
      })
      .catch((err) => buffer.error(err));

    interval(this.intervalMs)
      .pipe(mergeMap(this.dataFactory), takeUntil(this.stop))
      .subscribe(buffer);
    return buffer.asObservable();
  }
}

class LazyUnsubscribe implements Unsubscribable {
  constructor(private callback: () => void = null) { }
  unsubscribe(): void {
    if (this.callback)
      this.callback();
  }
}

export const getDynamicServerInfo = () => {

  // if not disabled, we collect stats in the background
  // this was the default behavior until now. keeping it as is
  const runInBackground = !CONFIG.disable_background_stats_collection;

  const cpuObs = new LazyObservable(
    'CPU',
    CONFIG.widget_list.includes('cpu'),
    runInBackground,
    CONFIG.cpu_shown_datapoints,
    CONFIG.cpu_poll_interval,
    getCpuInfo.dynamic,
  );

  const ramObs = new LazyObservable(
    'RAM',
    CONFIG.widget_list.includes('ram'),
    runInBackground,
    CONFIG.ram_shown_datapoints,
    CONFIG.ram_poll_interval,
    getRamInfo.dynamic,
  );

  const storageObs = new LazyObservable(
    'Storage',
    CONFIG.widget_list.includes('storage'),
    runInBackground,
    1,
    CONFIG.storage_poll_interval,
    getStorageInfo.dynamic,
  );

  const networkObs = new LazyObservable(
    'Network',
    CONFIG.widget_list.includes('network'),
    runInBackground,
    CONFIG.network_shown_datapoints,
    CONFIG.network_poll_interval,
    getNetworkInfo.dynamic,
  );

  const gpuObs = new LazyObservable(
    'GPU',
    CONFIG.widget_list.includes('gpu'),
    runInBackground,
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
