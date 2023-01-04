import { CpuInfo, CpuLoad } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../config';
import { getStaticServerInfo } from '../static-info';

const normalizeCpuModel = (cpuModel: string) => {
  return cpuModel
    .replace(/Processor/g, '')
    .replace(/[A-Za-z0-9]*-Core/g, '')
    .trim();
};

export default {
  dynamic: async (): Promise<CpuLoad> => {
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
  },
  static: async (): Promise<CpuInfo> => {
    const info = await si.cpu();

    return {
      brand: info.manufacturer,
      model: normalizeCpuModel(info.brand),
      cores: info.physicalCores,
      threads: info.cores,
      frequency: info.speed,
    };
  },
};
