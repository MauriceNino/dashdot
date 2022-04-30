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
    vendor: string;
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
    storage_vendor_1?: string;
    storage_capacity_1?: number;
    storage_type_1?: string;
    storage_vendor_2?: string;
    storage_capacity_2?: number;
    storage_type_2?: string;
    storage_vendor_3?: string;
    storage_capacity_3?: number;
    storage_type_3?: string;
    storage_vendor_4?: string;
    storage_capacity_4?: number;
    storage_type_4?: string;
    storage_vendor_5?: string;
    storage_capacity_5?: number;
    storage_type_5?: string;
  };
};

export type ServerInfo = HardwareInfo & {
  config: Config;
};
