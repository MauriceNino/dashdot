---
sidebar_position: 4
description: Override specific labels in your widgets
tags:
  - Configuration
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

Pass a list of key-value pairs where the key is the device name of your drive (have a look in the log in `Static Server Info` > `storage` to gather the device name) and the value is the new brand of the device. An example value could be `sda=Samsung,sdb=Western Digital`.

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_STORAGE_SIZES`

Pass a list of key-value pairs where the key is the device name of your drive (have a look in the log in `Static Server Info` > `storage` to gather the device name) and the value is the new size of the device (In RAIDS you only need to apply this to a single drive in the RAID). An example value could be `sda=56127367,sdb=6172637222`.
Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`).

- type: `string`
- default: `unset`

## `DASHDOT_OVERRIDE_STORAGE_TYPES`

Pass a list of key-value pairs where the key is the device name of your drive (have a look in the log in `Static Server Info` > `storage` to gather the device name) and the value is the new type of the device. An example value could be `sda=SSD,sdb=HDD`.

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
