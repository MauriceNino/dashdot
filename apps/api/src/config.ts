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

export const CONFIG: Config = {
  port: numNull(penv('PORT')) ?? 3001,
  widget_list: lst(
    penv('WIDGET_LIST') ?? 'os,cpu,storage,ram,network'
  ) as any[],
  accept_ookla_eula: penv('ACCEPT_OOKLA_EULA') === 'true',
  use_imperial: penv('USE_IMPERIAL') === 'true',

  disable_host: penv('DISABLE_HOST') === 'true',
  os_label_list: lst(penv('OS_LABEL_LIST') ?? 'os,arch,up_since') as any[],
  os_widget_grow: numNull(penv('OS_WIDGET_GROW')) ?? 1.5,
  os_widget_min_width: numNull(penv('OS_WIDGET_MIN_WIDTH')) ?? 300,

  enable_cpu_temps: penv('ENABLE_CPU_TEMPS') === 'true',
  cpu_label_list: lst(
    penv('CPU_LABEL_LIST') ?? 'brand,model,cores,threads,frequency'
  ) as any[],
  cpu_widget_grow: numNull(penv('CPU_WIDGET_GROW')) ?? 4,
  cpu_widget_min_width: numNull(penv('CPU_WIDGET_MIN_WIDTH')) ?? 500,
  cpu_shown_datapoints: numNull(penv('CPU_SHOWN_DATAPOINTS')) ?? 20,
  cpu_poll_interval: numNull(penv('CPU_POLL_INTERVAL')) ?? 1000,

  storage_label_list: lst(
    penv('STORAGE_LABEL_LIST') ?? 'brand,size,type,raid'
  ) as any[],
  storage_widget_grow: numNull(penv('STORAGE_WIDGET_GROW')) ?? 3.5,
  storage_widget_min_width: numNull(penv('STORAGE_WIDGET_MIN_WIDTH')) ?? 500,
  storage_poll_interval: numNull(penv('STORAGE_POLL_INTERVAL')) ?? 60000,

  ram_label_list: lst(
    penv('RAM_LABEL_LIST') ?? 'brand,size,type,frequency'
  ) as any[],
  ram_widget_grow: numNull(penv('RAM_WIDGET_GROW')) ?? 4,
  ram_widget_min_width: numNull(penv('RAM_WIDGET_MIN_WIDTH')) ?? 500,
  ram_shown_datapoints: numNull(penv('RAM_SHOWN_DATAPOINTS')) ?? 20,
  ram_poll_interval: numNull(penv('RAM_POLL_INTERVAL')) ?? 1000,

  speed_test_interval: numNull(penv('SPEED_TEST_INTERVAL')) ?? 60,
  network_label_list: lst(
    penv('NETWORK_LABEL_LIST') ?? 'type,speed_up,speed_down,interface_speed'
  ) as any[],
  network_widget_grow: numNull(penv('NETWORK_WIDGET_GROW')) ?? 6,
  network_widget_min_width: numNull(penv('NETWORK_WIDGET_MIN_WIDTH')) ?? 500,
  network_shown_datapoints: numNull(penv('NETWORK_SHOWN_DATAPOINTS')) ?? 20,
  network_poll_interval: numNull(penv('NETWORK_POLL_INTERVAL')) ?? 1000,

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
    storage_brands: lst(penv('OVERRIDE_STORAGE_BRANDS') ?? ''),
    storage_sizes: numlst(penv('OVERRIDE_STORAGE_SIZES') ?? ''),
    storage_types: lst(penv('OVERRIDE_STORAGE_TYPES') ?? ''),
  },
};
