import { Config } from '@dash/common';

const numNull = (val: string | undefined): number | undefined => {
  if (val === undefined || val === '') {
    return undefined;
  }
  return +val;
};

const penv = (key: string): string | undefined => process.env[`DASHDOT_${key}`];
const lst = (item: string): string[] => (item === '' ? [] : item.split(','));
const numlst = (item: string): number[] => lst(item).map(numNull);
const kv = <T extends boolean>(
  inp: string[],
  toNum: T
): Record<string, T extends true ? number : string> =>
  Object.fromEntries(
    inp.map(p => {
      const [key, value] = p.split('=');
      if (toNum) {
        return [key, +value];
      } else {
        return [key, value];
      }
    })
  );

export const CONFIG: Config = {
  port: numNull(penv('PORT')) ?? 3001,
  running_in_docker: penv('RUNNING_IN_DOCKER') === 'true',
  accept_ookla_eula: penv('ACCEPT_OOKLA_EULA') === 'true',
  use_network_interface: penv('USE_NETWORK_INTERFACE'),
  speed_test_from_path: penv('SPEED_TEST_FROM_PATH'),
  fs_device_filter: lst(penv('FS_DEVICE_FILTER') ?? ''),
  fs_type_filter: lst(
    penv('FS_TYPE_FILTER') ??
      'cifs,9p,fuse.rclone,fuse.mergerfs,nfs4,iso9660,fuse.shfs'
  ),
  fs_virtual_mounts: lst(penv('FS_VIRTUAL_MOUNTS') ?? ''),
  disable_integrations: penv('DISABLE_INTEGRATIONS') === 'true',

  show_dash_version: penv('SHOW_DASH_VERSION') as any,
  show_host: penv('SHOW_HOST') === 'true',
  custom_host: penv('CUSTOM_HOST'),
  page_title: penv('PAGE_TITLE') ?? 'dash.',
  use_imperial: penv('USE_IMPERIAL') === 'true',
  always_show_percentages: penv('ALWAYS_SHOW_PERCENTAGES') === 'true',

  widget_list: lst(
    penv('WIDGET_LIST') ?? 'os,cpu,storage,ram,network'
  ) as any[],
  os_label_list: lst(penv('OS_LABEL_LIST') ?? 'os,arch,up_since') as any[],
  cpu_label_list: lst(
    penv('CPU_LABEL_LIST') ?? 'brand,model,cores,threads,frequency'
  ) as any[],
  storage_label_list: lst(
    penv('STORAGE_LABEL_LIST') ?? 'brand,type,size,raid'
  ) as any[],
  ram_label_list: lst(
    penv('RAM_LABEL_LIST') ?? 'brand,type,size,frequency'
  ) as any[],
  network_label_list: lst(
    penv('NETWORK_LABEL_LIST') ?? 'type,speed_up,speed_down,interface_speed'
  ) as any[],
  gpu_label_list: lst(penv('GPU_LABEL_LIST') ?? 'brand,model,memory') as any[],

  os_widget_grow: numNull(penv('OS_WIDGET_GROW')) ?? 2.5,
  os_widget_min_width: numNull(penv('OS_WIDGET_MIN_WIDTH')) ?? 300,

  enable_cpu_temps: penv('ENABLE_CPU_TEMPS') === 'true',
  cpu_widget_grow: numNull(penv('CPU_WIDGET_GROW')) ?? 4,
  cpu_widget_min_width: numNull(penv('CPU_WIDGET_MIN_WIDTH')) ?? 500,
  cpu_shown_datapoints: numNull(penv('CPU_SHOWN_DATAPOINTS')) ?? 20,
  cpu_poll_interval: numNull(penv('CPU_POLL_INTERVAL')) ?? 1000,

  storage_widget_items_per_page:
    numNull(penv('STORAGE_WIDGET_ITEMS_PER_PAGE')) ?? 3,
  storage_widget_grow: numNull(penv('STORAGE_WIDGET_GROW')) ?? 3.5,
  storage_widget_min_width: numNull(penv('STORAGE_WIDGET_MIN_WIDTH')) ?? 500,
  storage_poll_interval: numNull(penv('STORAGE_POLL_INTERVAL')) ?? 60000,

  ram_widget_grow: numNull(penv('RAM_WIDGET_GROW')) ?? 4,
  ram_widget_min_width: numNull(penv('RAM_WIDGET_MIN_WIDTH')) ?? 500,
  ram_shown_datapoints: numNull(penv('RAM_SHOWN_DATAPOINTS')) ?? 20,
  ram_poll_interval: numNull(penv('RAM_POLL_INTERVAL')) ?? 1000,

  speed_test_interval: numNull(penv('SPEED_TEST_INTERVAL')) ?? 60 * 4,
  network_widget_grow: numNull(penv('NETWORK_WIDGET_GROW')) ?? 6,
  network_widget_min_width: numNull(penv('NETWORK_WIDGET_MIN_WIDTH')) ?? 500,
  network_shown_datapoints: numNull(penv('NETWORK_SHOWN_DATAPOINTS')) ?? 20,
  network_poll_interval: numNull(penv('NETWORK_POLL_INTERVAL')) ?? 1000,

  gpu_widget_grow: numNull(penv('GPU_WIDGET_GROW')) ?? 6,
  gpu_widget_min_width: numNull(penv('GPU_WIDGET_MIN_WIDTH')) ?? 700,
  gpu_shown_datapoints: numNull(penv('GPU_SHOWN_DATAPOINTS')) ?? 20,
  gpu_poll_interval: numNull(penv('GPU_POLL_INTERVAL')) ?? 1000,

  override: {
    os: penv('OVERRIDE_OS'),
    arch: penv('OVERRIDE_ARCH'),
    cpu_brand: penv('OVERRIDE_CPU_BRAND'),
    cpu_model: penv('OVERRIDE_CPU_MODEL'),
    cpu_cores: numNull(penv('OVERRIDE_CPU_CORES')),
    cpu_threads: numNull(penv('OVERRIDE_CPU_THREADS')),
    cpu_frequency: numNull(penv('OVERRIDE_CPU_FREQUENCY')),
    ram_brand: penv('OVERRIDE_RAM_BRAND'),
    ram_size: numNull(penv('OVERRIDE_RAM_SIZE')),
    ram_type: penv('OVERRIDE_RAM_TYPE'),
    ram_frequency: numNull(penv('OVERRIDE_RAM_FREQUENCY')),
    network_type: penv('OVERRIDE_NETWORK_TYPE'),
    network_speed_up: numNull(penv('OVERRIDE_NETWORK_SPEED_UP')),
    network_speed_down: numNull(penv('OVERRIDE_NETWORK_SPEED_DOWN')),
    network_interface_speed: numNull(penv('OVERRIDE_NETWORK_INTERFACE_SPEED')),
    network_public_ip: penv('OVERRIDE_NETWORK_PUBLIC_IP'),
    storage_brands: kv(lst(penv('OVERRIDE_STORAGE_BRANDS') ?? ''), false),
    storage_sizes: kv(lst(penv('OVERRIDE_STORAGE_SIZES') ?? ''), true),
    storage_types: kv(lst(penv('OVERRIDE_STORAGE_TYPES') ?? ''), false),
    gpu_brands: lst(penv('OVERRIDE_GPU_BRANDS') ?? ''),
    gpu_models: lst(penv('OVERRIDE_GPU_MODELS') ?? ''),
    gpu_memories: numlst(penv('OVERRIDE_GPU_MEMORIES') ?? ''),
  },
};
