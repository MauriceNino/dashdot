import { CpuLoad, RamLoad } from "dashdot-shared";
import { interval, map } from "rxjs";
import si from "systeminformation";

const getCpuInfo = async (): Promise<CpuLoad> => {
  const cpuLoad = (await si.currentLoad()).cpus;

  return cpuLoad.map((load, i) => ({
    load: load.load,
    core: i,
  }));
};

export const cpuObs = interval(1000).pipe(map(() => getCpuInfo()));

const getRamInfo = async (): Promise<RamLoad> => {
  return (await si.mem()).used;
};

export const ramObs = interval(1000).pipe(map(() => getRamInfo()));

// const getStorageInfo = async (): Promise<RamLoad> => {
//   return (await si.di).used;
// };

// export const storageObs = interval(1000).pipe(map(() => getStorageInfo()));
