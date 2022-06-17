---
sidebar_position: 8
---

# Overrides

Override specific fields, by providing your desired value with the following options.

## `DASHDOT_OVERRIDE_OS`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_ARCH`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_CPU_BRAND`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_CPU_MODEL`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_CPU_CORES`

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_CPU_THREADS`

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_CPU_FREQUENCY`

Number needs to be passed in GHz (e.g. `2.8`)

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_RAM_BRAND`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_RAM_SIZE`

Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`)

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_RAM_TYPE`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_RAM_FREQUENCY`

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_NETWORK_TYPE`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_NETWORK_SPEED_UP`

Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_NETWORK_SPEED_DOWN`

Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_NETWORK_INTERFACE_SPEED`

Number needs to be passed in Megabit (e.g. `10000` for 10 GB/s, because it is `10 * 1000`)

- type: `number`
- default: `unset`

## `DASHDOT_OVERRIDE_NETWORK_PUBLIC_IP`

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_STORAGE_BRANDS`

Pass a comma-separated list of brands of your drives. You can skip correct drives, by passing empty values for it (e.g. `Samsung,,WD` would result in `Samsung` for Drive 1 and `WD` for Drive 3).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_STORAGE_SIZES`

Pass a comma-separated list of sizes of your drives. You can skip correct drives, by passing empty values for it (e.g. `123,,321` would result in `123` for Drive 1 and `321` for Drive 3). Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_STORAGE_TYPES`

Pass a comma-separated list of types of your drives. You can skip correct drives, by passing empty values for it (e.g. `SSD,,HDD` would result in `SSD` for Drive 1 and `HDD` for Drive 3).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_GPU_BRANDS`

Pass a comma-separated list of brands of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `Intel,,Nvidia` would result in `Intel` for GPU 1 and `Nvidia` for GPU 3).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_GPU_MODELS`

Pass a comma-separated list of models of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `CometLake-H GT2,,GeForce GTX 1650 Ti` would result in `CometLake-H GT2` for GPU 1 and `GeForce GTX 1650 Ti` for GPU 3).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_GPU_MEMORIES`

Pass a comma-separated list of memory-sizes of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `4096,,256` would result in `4 GiB` for GPU 1 and `256 MiB` for GPU 3).

- type: `string`
- default: `unset`
