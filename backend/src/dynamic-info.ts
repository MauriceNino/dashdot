import { CpuLoad, RamLoad, StorageLoad } from 'dashdot-shared';
import { interval, mergeMap, Observable, ReplaySubject } from 'rxjs';
import si from 'systeminformation';

const createBufferedInterval = <R>(
  bufferSize: number,
  intervalMs: number,
  factory: () => Promise<R>
): Observable<R> => {
  const buffer = new ReplaySubject<R>(bufferSize);

  // Instantly load first value
  factory()
    .then(value => buffer.next(value))
    .catch(err => buffer.error(err));

  // Load values every intervalMs
  interval(intervalMs).pipe(mergeMap(factory)).subscribe(buffer);

  return buffer.asObservable();
};

export const cpuObs = createBufferedInterval(
  20,
  1000,
  async (): Promise<CpuLoad> => {
    const cpuLoad = (await si.currentLoad()).cpus;

    return cpuLoad.map((load, i) => ({
      load: load.load,
      core: i,
    }));
  }
);

export const ramObs = createBufferedInterval(
  20,
  1000,
  async (): Promise<RamLoad> => {
    return (await si.mem()).active;
  }
);

export const storageObs = createBufferedInterval(
  20,
  1000 * 60,
  async (): Promise<StorageLoad> => {
    const data = await si.fsSize();
    const root = data.find(d => d.mount === '/');

    return root?.used!;
  }
);
