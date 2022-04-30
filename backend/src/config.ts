import { Config } from 'dashdot-shared';

const numOrUndefined = (val: string | undefined): number | undefined => {
  if (val === undefined) {
    return undefined;
  }
  return +val;
};

export const CONFIG: Config = {
  port: +(process.env.DASHDOT_PORT ?? 3001),
  disable_tilt: process.env.DASHDOT_DISABLE_TILT === 'true',
  override: {
    os: process.env.DASHDOT_OVERRIDE_OS,
    arch: process.env.DASHDOT_OVERRIDE_ARCH,
    cpu_brand: process.env.DASHDOT_OVERRIDE_CPU_BRAND,
    cpu_model: process.env.DASHDOT_OVERRIDE_CPU_MODEL,
    cpu_cores: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_CORES),
    cpu_threads: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_THREADS),
    cpu_frequency: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_FREQUENCY),
    ram_brand: process.env.DASHDOT_OVERRIDE_RAM_BRAND,
    ram_size: numOrUndefined(process.env.DASHDOT_OVERRIDE_RAM_SIZE),
    ram_type: process.env.DASHDOT_OVERRIDE_RAM_TYPE,
    ram_frequency: numOrUndefined(process.env.DASHDOT_OVERRIDE_RAM_FREQUENCY),
    storage_brand_1: process.env.DASHDOT_OVERRIDE_STORAGE_BRAND_1,
    storage_size_1: numOrUndefined(process.env.DASHDOT_OVERRIDE_STORAGE_SIZE_1),
    storage_type_1: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
    storage_brand_2: process.env.DASHDOT_OVERRIDE_STORAGE_BRAND_2,
    storage_size_2: numOrUndefined(process.env.DASHDOT_OVERRIDE_STORAGE_SIZE_2),
    storage_type_2: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_2,
    storage_brand_3: process.env.DASHDOT_OVERRIDE_STORAGE_BRAND_3,
    storage_size_3: numOrUndefined(process.env.DASHDOT_OVERRIDE_STORAGE_SIZE_3),
    storage_type_3: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_3,
    storage_brand_4: process.env.DASHDOT_OVERRIDE_STORAGE_BRAND_4,
    storage_size_4: numOrUndefined(process.env.DASHDOT_OVERRIDE_STORAGE_SIZE_4),
    storage_type_4: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_4,
    storage_brand_5: process.env.DASHDOT_OVERRIDE_STORAGE_BRAND_5,
    storage_size_5: numOrUndefined(process.env.DASHDOT_OVERRIDE_STORAGE_SIZE_5),
    storage_type_5: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_5,
  },
};
