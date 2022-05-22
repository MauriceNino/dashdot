import { Config } from 'dashdot-shared';

const numOrUndefined = (val: string | undefined): number | undefined => {
  if (val === undefined) {
    return undefined;
  }
  return +val;
};

const penv = (key: string): string | undefined => process.env[`DASHDOT_${key}`];

export const CONFIG: Config = {
  port: numOrUndefined(penv('PORT')) ?? 3001,
  enable_tilt: penv('ENABLE_TILT') === 'true',
  widget_order: penv('WIDGET_ORDER') ?? 'os,cpu,ram,storage',

  disable_host: penv('DISABLE_HOST') === 'true',
  os_widget_enable: penv('OS_WIDGET_ENABLE') !== 'false',
  os_widget_grow: numOrUndefined(penv('OS_WIDGET_GROW')) ?? 1,

  enable_cpu_temps: penv('ENABLE_CPU_TEMPS') === 'true',
  cpu_widget_enable: penv('CPU_WIDGET_ENABLE') !== 'false',
  cpu_widget_grow: numOrUndefined(penv('CPU_WIDGET_GROW')) ?? 2,
  cpu_shown_datapoints: numOrUndefined(penv('CPU_SHOWN_DATAPOINTS')) ?? 20,
  cpu_poll_interval: numOrUndefined(penv('CPU_POLL_INTERVAL')) ?? 1000,

  ram_widget_enable: penv('RAM_WIDGET_ENABLE') !== 'false',
  ram_widget_grow: numOrUndefined(penv('RAM_WIDGET_GROW')) ?? 1.5,
  ram_shown_datapoints: numOrUndefined(penv('RAM_SHOWN_DATAPOINTS')) ?? 20,
  ram_poll_interval: numOrUndefined(penv('RAM_POLL_INTERVAL')) ?? 1000,

  storage_widget_enable: penv('STORAGE_WIDGET_ENABLE') !== 'false',
  storage_widget_grow: numOrUndefined(penv('STORAGE_WIDGET_GROW')) ?? 1.5,
  storage_poll_interval: numOrUndefined(penv('STORAGE_POLL_INTERVAL')) ?? 60000,

  override: {
    os: penv('OVERRIDE_OS'),
    arch: penv('OVERRIDE_ARCH'),
    cpu_brand: penv('OVERRIDE_CPU_BRAND'),
    cpu_model: penv('OVERRIDE_CPU_MODEL'),
    cpu_cores: numOrUndefined(penv('OVERRIDE_CPU_CORES')),
    cpu_threads: numOrUndefined(penv('OVERRIDE_CPU_THREADS')),
    cpu_frequency: numOrUndefined(penv('OVERRIDE_CPU_FREQUENCY')),
    ram_brand: penv('OVERRIDE_RAM_BRAND'),
    ram_size: numOrUndefined(penv('OVERRIDE_RAM_SIZE')),
    ram_type: penv('OVERRIDE_RAM_TYPE'),
    ram_frequency: numOrUndefined(penv('OVERRIDE_RAM_FREQUENCY')),
    storage_brand_1: penv('OVERRIDE_STORAGE_BRAND_1'),
    storage_size_1: numOrUndefined(penv('OVERRIDE_STORAGE_SIZE_1')),
    storage_type_1: penv('OVERRIDE_STORAGE_TYPE_1'),
    storage_brand_2: penv('OVERRIDE_STORAGE_BRAND_2'),
    storage_size_2: numOrUndefined(penv('OVERRIDE_STORAGE_SIZE_2')),
    storage_type_2: penv('OVERRIDE_STORAGE_TYPE_2'),
    storage_brand_3: penv('OVERRIDE_STORAGE_BRAND_3'),
    storage_size_3: numOrUndefined(penv('OVERRIDE_STORAGE_SIZE_3')),
    storage_type_3: penv('OVERRIDE_STORAGE_TYPE_3'),
    storage_brand_4: penv('OVERRIDE_STORAGE_BRAND_4'),
    storage_size_4: numOrUndefined(penv('OVERRIDE_STORAGE_SIZE_4')),
    storage_type_4: penv('OVERRIDE_STORAGE_TYPE_4'),
    storage_brand_5: penv('OVERRIDE_STORAGE_BRAND_5'),
    storage_size_5: numOrUndefined(penv('OVERRIDE_STORAGE_SIZE_5')),
    storage_type_5: penv('OVERRIDE_STORAGE_TYPE_5'),
  },
};
