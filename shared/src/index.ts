export type CpuInfo = {
  manufacturer: string;
  brand: string;
  speed: number;
  cores: number;
  threads: number;
};
export type CpuLoad = {
  core: number;
  load: number;
}[];

export type RamInfo = {
  total: number;
  layout: {
    type?: string;
    manufacturer?: string;
    clockSpeed?: number;
  }[];
};
export type RamLoad = number;

export type StorageInfo = {
  layout: {
    type: string;
    name: string;
    size: number;
  }[];
};
export type StorageLoad = number;

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

export type Config = {
  port: number;
  override: {
    distro?: string;
    release?: string;
    arch?: string;
    platform?: string;
    cpu_brand?: string;
    cpu_model?: string;
    cpu_cores?: number;
    cpu_threads?: number;
    cpu_frequency?: number;
    ram_brand?: string;
    ram_size?: number;
    ram_type?: string;
    ram_speed?: number;
    storage_model?: string;
    storage_capacity?: number;
    storage_type?: string;
  };
};

export type ServerInfo = HardwareInfo & {
  config: Config;
};
