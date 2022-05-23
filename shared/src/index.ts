export type CpuInfo = {
  brand: string;
  model: string;
  cores: number;
  threads: number;
  frequency: number;
};
export type CpuLoad = {
  core: number;
  load: number;
  temp: number;
}[];

export type RamInfo = {
  size: number;
  layout: {
    brand?: string;
    type?: string;
    frequency?: number;
  }[];
};
export type RamLoad = number;

export type StorageInfo = {
  layout: {
    brand: string;
    size: number;
    type: string;
  }[];
};
export type StorageLoad = number;

export type NetworkInfo = {
  interfaceSpeed: number;
  speedDown: number;
  speedUp: number;
  type: string;
};
export type NetworkLoad = {
  up: number;
  down: number;
};

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
  network: NetworkInfo;
};

export type Config = {
  // General
  port: number;
  enable_tilt: boolean;
  widget_order: string;

  // OS Widget
  disable_host: boolean;
  os_widget_enable: boolean;
  os_widget_grow: number;
  os_widget_min_width: number;

  // CPU Widget
  enable_cpu_temps: boolean;
  cpu_widget_enable: boolean;
  cpu_widget_grow: number;
  cpu_widget_min_width: number;
  cpu_shown_datapoints: number;
  cpu_poll_interval: number;

  // Storage Widget
  storage_widget_enable: boolean;
  storage_widget_grow: number;
  storage_widget_min_width: number;
  storage_poll_interval: number;

  // RAM Widget
  ram_widget_enable: boolean;
  ram_widget_grow: number;
  ram_widget_min_width: number;
  ram_shown_datapoints: number;
  ram_poll_interval: number;

  // Network Widget
  network_widget_enable: boolean;
  network_widget_grow: number;
  network_widget_min_width: number;
  network_shown_datapoints_up: number;
  network_shown_datapoints_down: number;
  network_poll_interval: number;

  // Overrides
  override: {
    os?: string;
    arch?: string;
    cpu_brand?: string;
    cpu_model?: string;
    cpu_cores?: number;
    cpu_threads?: number;
    cpu_frequency?: number;
    ram_brand?: string;
    ram_size?: number;
    ram_type?: string;
    ram_frequency?: number;
    storage_brand_1?: string;
    storage_size_1?: number;
    storage_type_1?: string;
    storage_brand_2?: string;
    storage_size_2?: number;
    storage_type_2?: string;
    storage_brand_3?: string;
    storage_size_3?: number;
    storage_type_3?: string;
    storage_brand_4?: string;
    storage_size_4?: number;
    storage_type_4?: string;
    storage_brand_5?: string;
    storage_size_5?: number;
    storage_type_5?: string;
  };
};

export type ServerInfo = HardwareInfo & {
  config: Config;
};
