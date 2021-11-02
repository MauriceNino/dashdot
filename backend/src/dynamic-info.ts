import { CpuLoad, RamLoad, StorageLoad } from 'dashdot-shared';
import { interval, mergeMap, ReplaySubject } from 'rxjs';
import si from 'systeminformation';

// READING CPU INFO
const getCpuInfo = async (): Promise<CpuLoad> => {
  const cpuLoad = (await si.currentLoad()).cpus;

  return cpuLoad.map((load, i) => ({
    load: load.load,
    core: i,
  }));
};

const cpuBuffer = new ReplaySubject(20);
interval(1000).pipe(mergeMap(getCpuInfo)).subscribe(cpuBuffer);
export const cpuObs = cpuBuffer.asObservable();

// READING RAM INFO
const getRamInfo = async (): Promise<RamLoad> => {
  return (await si.mem()).used;
};

const ramBuffer = new ReplaySubject(20);
interval(1000).pipe(mergeMap(getRamInfo)).subscribe(ramBuffer);
export const ramObs = ramBuffer.asObservable();

// READING STORAGE INFO
const getStorageInfo = async (): Promise<StorageLoad> => {
  const data = await si.fsSize();

  return {
    free: data.reduce((acc, cur) => acc + cur.available, 0),
    used: data.reduce((acc, cur) => acc + cur.used, 0),
  };
};

const storageBuffer = new ReplaySubject(1);
interval(1000 * 60)
  .pipe(mergeMap(getStorageInfo))
  .subscribe(storageBuffer);
export const storageObs = storageBuffer.asObservable();
