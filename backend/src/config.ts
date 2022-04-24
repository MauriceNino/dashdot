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
    storage_model: process.env.DASHDOT_OVERRIDE_STORAGE_MODEL,
    storage_capacity: numOrUndefined(
      process.env.DASHDOT_OVERRIDE_STORAGE_CAPACITY
    ),
    storage_type: process.env.DASHDOT_OVERRIDE_STORAGE_TYPE,
  },
};
