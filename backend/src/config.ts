import { Config } from 'dashdot-shared';

const numOrUndefined = (val: string | undefined): number | undefined => {
  if (val === undefined) {
    return undefined;
  }
  return +val;
};

export const CONFIG: Config = {
  port: +(process.env.DASHDOT_PORT ?? 3001),
  override: {
    distro: process.env.DASHDOT_OVERRIDE_DISTRO,
    release: process.env.DASHDOT_OVERRIDE_RELEASE,
    platform: process.env.DASHDOT_OVERRIDE_PLATFORM,
    arch: process.env.DASHDOT_OVERRIDE_ARCH,
    cpu_brand: process.env.DASHDOT_OVERRIDE_CPU_BRAND,
    cpu_model: process.env.DASHDOT_OVERRIDE_CPU_MODEL,
    cpu_cores: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_CORES),
    cpu_threads: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_THREADS),
    cpu_frequency: numOrUndefined(process.env.DASHDOT_OVERRIDE_CPU_FREQUENCY),
    ram_brand: process.env.DASHDOT_OVERRIDE_RAM_BRAND,
    ram_size: numOrUndefined(process.env.DASHDOT_OVERRIDE_RAM_SIZE),
    ram_type: process.env.DASHDOT_OVERRIDE_RAM_TYPE,
    ram_speed: numOrUndefined(process.env.DASHDOT_OVERRIDE_RAM_SPEED),
    storage_vendor_1: process.env.DASHDOT_OVERRIDE_STORAGE_VENDOR_1,
    storage_capacity_1: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY_1
    ),
    storage_type_1: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
    storage_vendor_2: process.env.DASHDOT_OVERRIDE_STORAGE_VENDOR_1,
    storage_capacity_2: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY_1
    ),
    storage_type_2: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
    storage_vendor_3: process.env.DASHDOT_OVERRIDE_STORAGE_VENDOR_1,
    storage_capacity_3: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY_1
    ),
    storage_type_3: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
    storage_vendor_4: process.env.DASHDOT_OVERRIDE_STORAGE_VENDOR_1,
    storage_capacity_4: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY_1
    ),
    storage_type_4: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
    storage_vendor_5: process.env.DASHDOT_OVERRIDE_STORAGE_VENDOR_1,
    storage_capacity_5: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY_1
    ),
    storage_type_5: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE_1,
  },
};
