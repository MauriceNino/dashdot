export type CpuInfo = {};
export type CpuLoad = {};

export type RamInfo = {};
export type RamLoad = {};

export type DiskInfo = {};
export type DiskLoad = {};

export type OsInfo = {
  platform: string;
  distro: string;
  release: string;
  kernel: string;
  arch: string;
  uptime: number;
};

export type HardwareInfo = CpuInfo & RamInfo & DiskInfo & OsInfo;
