# Configuration Options

The following configuration options are available and can be passed as environment variables.

If you don't know how to set them, look up the section for your type of installment
in the [INSTALL.md](./INSTALL.md).

## General

<!-- markdownlint-disable -->

| Variable                    | Description                                                                                                                                                                                                                                                                                                        | Type    | Default Value                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ---------------------------- |
| `DASHDOT_PORT`              | The port where the express backend is running (the backend serves the frontend, so it is the same port for both)                                                                                                                                                                                                   | number  | `3001`                       |
| `DASHDOT_WIDGET_LIST`       | Change the order of the elements in the list, to change the position on the page, or remove an item from the list, to remove it from the page (The available options are: `os`, `cpu`, `storage`, `ram`, `network`, `gpu`)                                                                                         | string  | `os,cpu,storage,ram,network` |
| `DASHDOT_ACCEPT_OOKLA_EULA` | Use the newer and more accurate `speedtest` tool from Ookla, instead of the old `speedtest-cli` for your speedtests. When passing this flag, you accept Ooklas [EULA](https://www.speedtest.net/about/eula), [TERMS](https://www.speedtest.net/about/terms) and [PRIVACY](https://www.speedtest.net/about/privacy) | boolean | `false`                      |
| `DASHDOT_USE_IMPERIAL`      | Shows any units in the imperial system, instead of the default metric                                                                                                                                                                                                                                              | boolean | `false`                      |

<!-- markdownlint-enable -->

## OS Widget

<!-- markdownlint-disable -->

| Variable                      | Description                                                                                                                                                                                           | Type    | Default Value      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------ |
| `DASHDOT_DISABLE_HOST`        | If you want to hide the host part in the server widget (e.g. `dash.mauz.io` -> `dash.`)                                                                                                               | boolean | `false`            |
| `DASHDOT_OS_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `os`, `arch`, `up_since`) | string  | `os,arch,up_since` |
| `DASHDOT_OS_WIDGET_GROW`      | To adjust the relative size of the OS widget                                                                                                                                                          | number  | `1.5`              |
| `DASHDOT_OS_WIDGET_MIN_WIDTH` | To adjust the minimum width of the OS widget (in px)                                                                                                                                                  | number  | `300`              |

<!-- markdownlint-enable -->

## CPU Widget

<!-- markdownlint-disable -->

| Variable                       | Description                                                                                                                                                                                                                    | Type    | Default Value                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------------------------------------- |
| `DASHDOT_ENABLE_CPU_TEMPS`     | If you want to show the CPU temperature in the graph. This will probably not work on a VPS, so you need to try it on your own if this works. For home servers it might work just fine                                          | boolean | `false`                               |
| `DASHDOT_CPU_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `model`, `cores`, `threads`, `frequency`) | string  | `brand,model,cores,threads,frequency` |
| `DASHDOT_CPU_WIDGET_GROW`      | To adjust the relative size of the Processor widget                                                                                                                                                                            | number  | `4`                                   |
| `DASHDOT_CPU_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Processor widget (in px)                                                                                                                                                                    | number  | `500`                                 |
| `DASHDOT_CPU_DATAPOINTS`       | The amount of datapoints in the Processor graph                                                                                                                                                                                | number  | `20`                                  |
| `DASHDOT_CPU_POLL_INTERVAL`    | Read the Processor load every x milliseconds                                                                                                                                                                                   | number  | `1000`                                |

<!-- markdownlint-enable -->

## Storage Widget

<!-- markdownlint-disable -->

| Variable                           | Description                                                                                                                                                                                          | Type   | Default Value     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------- |
| `DASHDOT_STORAGE_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `size`, `type`) | string | `brand,size,type` |
| `DASHDOT_STORAGE_WIDGET_GROW`      | To adjust the relative size of the Storage widget                                                                                                                                                    | number | `3.5`             |
| `DASHDOT_STORAGE_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Storage widget (in px)                                                                                                                                            | number | `500`             |
| `DASHDOT_STORAGE_POLL_INTERVAL`    | Read the Storage load every x milliseconds                                                                                                                                                           | number | `60000`           |

<!-- markdownlint-enable -->

## RAM Widget

<!-- markdownlint-disable -->

| Variable                       | Description                                                                                                                                                                                                       | Type   | Default Value               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------- |
| `DASHDOT_RAM_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `size`, `type`, `frequency`) | string | `brand,size,type,frequency` |
| `DASHDOT_RAM_WIDGET_GROW`      | To adjust the relative size of the Memory widget                                                                                                                                                                  | number | `4`                         |
| `DASHDOT_RAM_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Memory widget (in px)                                                                                                                                                          | number | `500`                       |
| `DASHDOT_RAM_DATAPOINTS`       | The amount of datapoints in the Memory graph                                                                                                                                                                      | number | `20`                        |
| `DASHDOT_RAM_POLL_INTERVAL`    | Read the Memory load every x milliseconds                                                                                                                                                                         | number | `1000`                      |

<!-- markdownlint-enable -->

## Network Widget

<!-- markdownlint-disable -->

| Variable                           | Description                                                                                                                                                                                                                                   | Type   | Default Value                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------ |
| `DASHDOT_USE_NETWORK_INTERFACE`    | If dashdot detects the wrong gateway as your default interface, you can provide a name here that is used instead                                                                                                                              | string |                                            |
| `DASHDOT_SPEED_TEST_INTERVAL`      | At which interval the network speed-test should be rerun (in minutes)                                                                                                                                                                         | number | `60`                                       |
| `DASHDOT_NETWORK_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `type`, `speed_up`, `speed_down`, `interface_speed`, `public_ip`) | string | `type,speed_up,speed_down,interface_speed` |
| `DASHDOT_NETWORK_WIDGET_GROW`      | To adjust the relative size of the Network widget                                                                                                                                                                                             | number | `6`                                        |
| `DASHDOT_NETWORK_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Network widget (in px)                                                                                                                                                                                     | number | `500`                                      |
| `DASHDOT_NETWORK_DATAPOINTS`       | The amount of datapoints in each of the Network graphs                                                                                                                                                                                        | number | `20`                                       |
| `DASHDOT_NETWORK_POLL_INTERVAL`    | Read the Network load every x milliseconds                                                                                                                                                                                                    | number | `1000`                                     |

<!-- markdownlint-enable -->

## GPU Widget

<!-- markdownlint-disable -->

| Variable                       | Description                                                                                                                                                                                                          | Type   | Default Value                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------- |
| `DASHDOT_GPU_LABEL_LIST`       | Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `model`, `frequency`, `memory`) | string | `brand, model, frequency, memory` |
| `DASHDOT_GPU_WIDGET_GROW`      | To adjust the relative size of the GPU widget                                                                                                                                                                        | number | `4`                               |
| `DASHDOT_GPU_WIDGET_MIN_WIDTH` | To adjust the minimum width of the GPU widget (in px)                                                                                                                                                                | number | `500`                             |
| `DASHDOT_GPU_DATAPOINTS`       | The amount of datapoints in the GPU graph                                                                                                                                                                            | number | `20`                              |
| `DASHDOT_GPU_POLL_INTERVAL`    | Read the GPU load every x milliseconds                                                                                                                                                                               | number | `1000`                            |

## Overrides

Override specific fields, by providing your desired value with the following options.

<!-- markdownlint-disable -->

| Variable                                   | Description                                                                                                                                                                                                                                                                                            | Type   | Default Value |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------- |
| `DASHDOT_OVERRIDE_OS`                      |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_ARCH`                    |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_CPU_BRAND`               |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_CPU_MODEL`               |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_CPU_CORES`               |                                                                                                                                                                                                                                                                                                        | number |
| `DASHDOT_OVERRIDE_CPU_THREADS`             |                                                                                                                                                                                                                                                                                                        | number |
| `DASHDOT_OVERRIDE_CPU_FREQUENCY`           | Number needs to be passed in GHz (e.g. `2.8`)                                                                                                                                                                                                                                                          | number |
| `DASHDOT_OVERRIDE_RAM_BRAND`               |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_RAM_SIZE`                | Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`)                                                                                                                                                                                             | number |
| `DASHDOT_OVERRIDE_RAM_TYPE`                |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_RAM_FREQUENCY`           |                                                                                                                                                                                                                                                                                                        | number |
| `DASHDOT_OVERRIDE_NETWORK_TYPE`            |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_NETWORK_SPEED_UP`        | Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)                                                                                                                                                                                                    | number |
| `DASHDOT_OVERRIDE_NETWORK_SPEED_DOWN`      | Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)                                                                                                                                                                                                    | number |
| `DASHDOT_OVERRIDE_NETWORK_INTERFACE_SPEED` | Number needs to be passed in Megabit (e.g. `10000` for 10 GB/s, because it is `10 * 1000`)                                                                                                                                                                                                             | number |
| `DASHDOT_OVERRIDE_NETWORK_PUBLIC_IP`       |                                                                                                                                                                                                                                                                                                        | string |
| `DASHDOT_OVERRIDE_STORAGE_BRANDS`          | Pass a comma-separated list of brands of your drives. You can skip correct drives, by passing empty values for it (e.g. `Samsung,,WD` would result in `Samsung` for Drive 1 and `WD` for Drive 3)                                                                                                      | string |
| `DASHDOT_OVERRIDE_STORAGE_SIZES`           | Pass a comma-separated list of sizes of your drives. You can skip correct drives, by passing empty values for it (e.g. `123,,321` would result in `123` for Drive 1 and `321` for Drive 3). Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`) | string |
| `DASHDOT_OVERRIDE_STORAGE_TYPES`           | Pass a comma-separated list of types of your drives. You can skip correct drives, by passing empty values for it (e.g. `SSD,,HDD` would result in `SSD` for Drive 1 and `HDD` for Drive 3)                                                                                                             | string |
| `DASHDOT_OVERRIDE_GPU_BRANDS`              | Pass a comma-separated list of brands of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `Intel,,Nvidia` would result in `Intel` for GPU 1 and `Nvidia` for GPU 3)                                                                                                          | string |
| `DASHDOT_OVERRIDE_GPU_MODELS`              | Pass a comma-separated list of models of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `CometLake-H GT2,,GeForce GTX 1650 Ti` would result in `CometLake-H GT2` for GPU 1 and `GeForce GTX 1650 Ti` for GPU 3)                                                            | string |
| `DASHDOT_OVERRIDE_GPU_MEMORIES`            | Pass a comma-separated list of memory-sizes of your GPUs. You can skip correct GPUs, by passing empty values for it (e.g. `4096,,256` would result in `4 GiB` for GPU 1 and `256 MiB` for GPU 3)                                                                                                       | string |

<!-- markdownlint-enable -->
