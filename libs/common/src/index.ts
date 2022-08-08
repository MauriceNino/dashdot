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
    device: string;
    brand: string;
    size: number;
    type: string;
    raidGroup?: string;
    virtual?: boolean;
  }[];
};
export type StorageLoad = {
  layout: {
    load: number;
  }[];
};

export type NetworkInfo = {
  interfaceSpeed: number;
  speedDown: number;
  speedUp: number;
  type: string;
  publicIp: string;
};
export type NetworkLoad = {
  up: number;
  down: number;
};

export type GpuInfo = {
  layout: {
    brand: string;
    model: string;
    memory: number;
  }[];
};
export type GpuLoad = {
  layout: {
    load: number;
    memory: number;
  }[];
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
  gpu: GpuInfo;
};

export type Config = {
  // General
  port: number;
  running_in_docker: boolean;
  use_network_interface: string;
  accept_ookla_eula: boolean;
  fs_type_filter: string[];
  fs_virtual_mounts: string[];
  disable_integrations: boolean;

  show_host: boolean;
  page_title: string;
  use_imperial: boolean;
  enable_cpu_temps: boolean;
  enable_storage_split_view: boolean;
  always_show_percentages: boolean;

  // Widgets, Labels
  widget_list: ('os' | 'cpu' | 'storage' | 'ram' | 'network' | 'gpu')[];
  os_label_list: ('os' | 'arch' | 'up_since')[];
  cpu_label_list: ('brand' | 'model' | 'cores' | 'threads' | 'frequency')[];
  storage_label_list: ('brand' | 'size' | 'type' | 'raid')[];
  ram_label_list: ('brand' | 'size' | 'type' | 'frequency')[];
  network_label_list: (
    | 'type'
    | 'speed_up'
    | 'speed_down'
    | 'interface_speed'
    | 'public_ip'
  )[];
  gpu_label_list: ('brand' | 'model' | 'memory')[];

  // OS Widget
  os_widget_grow: number;
  os_widget_min_width: number;

  // CPU Widget
  cpu_widget_grow: number;
  cpu_widget_min_width: number;
  cpu_shown_datapoints: number;
  cpu_poll_interval: number;

  // Storage Widget
  storage_widget_grow: number;
  storage_widget_min_width: number;
  storage_poll_interval: number;

  // RAM Widget
  ram_widget_grow: number;
  ram_widget_min_width: number;
  ram_shown_datapoints: number;
  ram_poll_interval: number;

  // Network Widget
  speed_test_interval: number;
  network_widget_grow: number;
  network_widget_min_width: number;
  network_shown_datapoints: number;
  network_poll_interval: number;

  // GPU Widget
  gpu_widget_grow: number;
  gpu_widget_min_width: number;
  gpu_shown_datapoints: number;
  gpu_poll_interval: number;

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
    network_type?: string;
    network_speed_up?: number;
    network_speed_down?: number;
    network_interface_speed?: number;
    network_public_ip?: string;
    storage_brands: string[];
    storage_types: string[];
    storage_sizes: number[];
    gpu_brands: string[];
    gpu_models: string[];
    gpu_memories: number[];
  };
};

export type ServerInfo = HardwareInfo & {
  config: Config;
};

// This is needed for HMR to work, because it won't work on modules
// which only export types
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const loadCommons = () => {};
