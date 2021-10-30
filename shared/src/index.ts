export type CpuInfo = {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
  threads: number;
};
export type CpuLoad = {};

export type RamInfo = {
  total: number;
  layout: {
    type: string;
    manufacturer?: string;
    clockSpeed?: number;
  }[];
};
export type RamLoad = {};

export type StorageInfo = {
  layout: {
    type: string;
    name: string;
    size: number;
  }[];
};
export type StorageLoad = {};

export type OsInfo = {
  platform: string;
  distro: string;
  release: string;
  kernel: string;
  arch: string;
  uptime: number;
};

export type HardwareInfo = {
  os: OsInfo;
  cpu: CpuInfo;
  ram: RamInfo;
  storage: StorageInfo;
};
