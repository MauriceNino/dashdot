import { Config } from '@dash/common';

const numNull = (val: string | undefined): number | undefined => {
  if (val === undefined) {
    return undefined;
  }
  return +val;
};

const penv = (key: string): string | undefined => process.env[`DASHDOT_${key}`];

export const CONFIG: Config = {
  port: numNull(penv('PORT')) ?? 3001,
  enable_tilt: penv('ENABLE_TILT') === 'true',
  widget_order: penv('WIDGET_ORDER') ?? 'os,cpu,storage,ram,network',

  disable_host: penv('DISABLE_HOST') === 'true',
  os_widget_enable: penv('OS_WIDGET_ENABLE') !== 'false',
  os_widget_grow: numNull(penv('OS_WIDGET_GROW')) ?? 1.5,
  os_widget_min_width: numNull(penv('OS_WIDGET_MIN_WIDTH')) ?? 300,

  enable_cpu_temps: penv('ENABLE_CPU_TEMPS') === 'true',
  cpu_widget_enable: penv('CPU_WIDGET_ENABLE') !== 'false',
  cpu_widget_grow: numNull(penv('CPU_WIDGET_GROW')) ?? 4,
  cpu_widget_min_width: numNull(penv('CPU_WIDGET_MIN_WIDTH')) ?? 500,
  cpu_shown_datapoints: numNull(penv('CPU_SHOWN_DATAPOINTS')) ?? 20,
  cpu_poll_interval: numNull(penv('CPU_POLL_INTERVAL')) ?? 1000,

  storage_widget_enable: penv('STORAGE_WIDGET_ENABLE') !== 'false',
  storage_widget_grow: numNull(penv('STORAGE_WIDGET_GROW')) ?? 3.5,
  storage_widget_min_width: numNull(penv('STORAGE_WIDGET_MIN_WIDTH')) ?? 500,
  storage_poll_interval: numNull(penv('STORAGE_POLL_INTERVAL')) ?? 60000,

  ram_widget_enable: penv('RAM_WIDGET_ENABLE') !== 'false',
  ram_widget_grow: numNull(penv('RAM_WIDGET_GROW')) ?? 4,
  ram_widget_min_width: numNull(penv('RAM_WIDGET_MIN_WIDTH')) ?? 500,
  ram_shown_datapoints: numNull(penv('RAM_SHOWN_DATAPOINTS')) ?? 20,
  ram_poll_interval: numNull(penv('RAM_POLL_INTERVAL')) ?? 1000,

  speed_test_interval: numNull(penv('SPEED_TEST_INTERVAL')) ?? 60,
  network_widget_enable: penv('NETWORK_WIDGET_ENABLE') !== 'false',
  network_widget_grow: numNull(penv('NETWORK_WIDGET_GROW')) ?? 6,
  network_widget_min_width: numNull(penv('NETWORK_WIDGET_MIN_WIDTH')) ?? 500,
  network_shown_datapoints: numNull(penv('NETWORK_SHOWN_DATAPOINTS')) ?? 10,
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
    storage_brand_1: penv('OVERRIDE_STORAGE_BRAND_1'),
    storage_size_1: numNull(penv('OVERRIDE_STORAGE_SIZE_1')),
    storage_type_1: penv('OVERRIDE_STORAGE_TYPE_1'),
    storage_brand_2: penv('OVERRIDE_STORAGE_BRAND_2'),
    storage_size_2: numNull(penv('OVERRIDE_STORAGE_SIZE_2')),
    storage_type_2: penv('OVERRIDE_STORAGE_TYPE_2'),
    storage_brand_3: penv('OVERRIDE_STORAGE_BRAND_3'),
    storage_size_3: numNull(penv('OVERRIDE_STORAGE_SIZE_3')),
    storage_type_3: penv('OVERRIDE_STORAGE_TYPE_3'),
    storage_brand_4: penv('OVERRIDE_STORAGE_BRAND_4'),
    storage_size_4: numNull(penv('OVERRIDE_STORAGE_SIZE_4')),
    storage_type_4: penv('OVERRIDE_STORAGE_TYPE_4'),
    storage_brand_5: penv('OVERRIDE_STORAGE_BRAND_5'),
    storage_size_5: numNull(penv('OVERRIDE_STORAGE_SIZE_5')),
    storage_type_5: penv('OVERRIDE_STORAGE_TYPE_5'),
  },
};
