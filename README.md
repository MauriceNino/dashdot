<!-- markdownlint-disable -->
<h1>
  <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/banner_muted.png?raw=true" alt="dash. - a modern server dashboard">
</h1>

<div align="center">
  <a href="https://drone.mauz.io/MauriceNino/dashdot" target="_blank">
    <img src="https://drone.mauz.io/api/badges/MauriceNino/dashdot/status.svg">
  </a>
</div>

<br/>
<br/>

<p align="center">
  <b>dash.</b> (or <b>dashdot</b>) is a modern server dashboard, developed with a simple, but performant stack and designed with glassmorphism in mind. <br>
  <br>
  It is intended to be used for smaller VPS and private servers.
</p>
<p align="center">
  <a href="https://dash.mauz.io" target="_blank">Live Demo</a>
 |
  <a href="https://hub.docker.com/r/mauricenino/dashdot" target="_blank">Docker Image</a>
</p>

#

<!-- markdownlint-enable -->

**dash.** is a open-source project, so any contribution is highly appreciated.
If you are interested in further developing this project, have a look at the
[Contributing.md](./CONTRIBUTING.md).

In case you want to financially support this project, you can visit my
[GitHub Sponsors](https://github.com/sponsors/MauriceNino), or my [Ko-Fi](https://ko-fi.com/mauricenino).

## Preview

<!-- markdownlint-disable -->

| Darkmode                                                                                                                                      | Lightmode                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/screenshot_darkmode.png?raw=true" alt="screenshot of the darkmode"> | <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/screenshot_lightmode.png?raw=true" alt="screenshot of the lightmode"> |

<!-- markdownlint-enable -->

## Installation

### Docker

Images are hosted on [DockerHub](https://hub.docker.com/r/mauricenino/dashdot),
and are available for both AMD64 and ARM devices.

To read more about configuration options, you can visit [the configuration section](#Configuration).

```bash
# Config options can optionally passed using the --env flag.
# e.g: --env DASHDOT_ENABLE_CPU_TEMPS "true"

> docker container run -it \
  -p 80:3001 \
  -v /etc/os-release:/etc/os-release:ro \
  --net="host" \
  --privileged \
  --env DASHDOT_PORT="80" \
  mauricenino/dashdot
```

> Note: The `--privileged` flag is needed to correctly determine the memory info.

<!-- -->

> Note: The `--net="host"` flag is needed to correctly determine the network info.
> The port can still be changed with the `DASHDOT_PORT` environment variable.

<!-- -->

> Note: The volume mount on `/etc/os-release:/etc/os-release:ro` is for the
> dashboard to show the OS version of the host instead of the OS of the docker
> container (which is running on Alpine Linux). If you wish to show the docker
> container OS instead, just remove this line.

### Docker-Compose

To read more about configuration options, you can visit [the configuration section](#Configuration).

```yml
version: '3.5'

# Config options can optionally set, by using the environment field.
# e.g:
#   environment:
#     DASHDOT_ENABLE_CPU_TEMPS: "true"

services:
  dash:
    image: mauricenino/dashdot:latest
    restart: unless-stopped
    privileged: true
    network_mode: host
    environment:
      DASHDOT_PORT: '80'
    volumes:
      - /etc/os-release:/etc/os-release:ro
```

### Git

To download the repository and run it yourself, there are a few steps necessary:

If you have not already installed yarn, install it now:

```bash
> npm i -g yarn
```

After that, download and build the project (might take a few minutes)

```bash
> git clone https://github.com/MauriceNino/dashdot &&\
  cd dashdot &&\
  yarn &&\
  yarn build
```

When done, you can run the dashboard by executing:

```bash
# Config options can optionally passed using environment variables.
# e.g: export DASHDOT_PORT="8080"

> sudo yarn start
```

To read more about configuration options, you can visit [the configuration section](#Configuration-Options).

## Configuration Options

The following configuration options are available.

If you don't know how to set them, look up the section for your type of installment
(Docker, Docker-Compose or Git).

### General

<!-- markdownlint-disable -->

| Variable               | Description                                                                                                             | Type    | Default Value                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------- |
| `DASHDOT_PORT`         | The port where the express backend is running (the backend serves the frontend, so it is the same port for both)        | number  | `3001`                       |
| `DASHDOT_ENABLE_TILT`  | If you want to enable a [parallax tilt effect](https://github.com/mkosir/react-parallax-tilt) when hovering the widgets | boolean | `false`                      |
| `DASHDOT_WIDGET_ORDER` | Change the order of the elements in the list, to change the position on the page                                        | string  | `os,cpu,storage,ram,network` |

<!-- markdownlint-enable -->

### OS Widget

<!-- markdownlint-disable -->

| Variable                      | Description                                                                             | Type    | Default Value |
| ----------------------------- | --------------------------------------------------------------------------------------- | ------- | ------------- |
| `DASHDOT_DISABLE_HOST`        | If you want to hide the host part in the server widget (e.g. `dash.mauz.io` -> `dash.`) | boolean | `false`       |
| `DASHDOT_OS_WIDGET_ENABLE`    | To show/hide the OS widget                                                              | boolean | `true`        |
| `DASHDOT_OS_WIDGET_GROW`      | To adjust the relative size of the OS widget                                            | number  | `1.5`         |
| `DASHDOT_OS_WIDGET_MIN_WIDTH` | To adjust the minimum width of the OS widget (in px)                                    | number  | `300`         |

<!-- markdownlint-enable -->

### CPU Widget

<!-- markdownlint-disable -->

| Variable                       | Description                                                                                                                                                                           | Type    | Default Value |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------- |
| `DASHDOT_ENABLE_CPU_TEMPS`     | If you want to show the CPU temperature in the graph. This will probably not work on a VPS, so you need to try it on your own if this works. For home servers it might work just fine | boolean | `false`       |
| `DASHDOT_CPU_WIDGET_ENABLE`    | To show/hide the Processor widget                                                                                                                                                     | boolean | `true`        |
| `DASHDOT_CPU_WIDGET_GROW`      | To adjust the relative size of the Processor widget                                                                                                                                   | number  | `4`           |
| `DASHDOT_CPU_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Processor widget (in px)                                                                                                                           | number  | `500`         |
| `DASHDOT_CPU_DATAPOINTS`       | The amount of datapoints in the Processor graph                                                                                                                                       | number  | `20`          |
| `DASHDOT_CPU_POLL_INTERVAL`    | Read the Processor load every x milliseconds                                                                                                                                          | number  | `1000`        |

<!-- markdownlint-enable -->

## Storage Widget

<!-- markdownlint-disable -->

| Variable                           | Description                                               | Type    | Default Value |
| ---------------------------------- | --------------------------------------------------------- | ------- | ------------- |
| `DASHDOT_STORAGE_WIDGET_ENABLE`    | To show/hide the Storage widget                           | boolean | `true`        |
| `DASHDOT_STORAGE_WIDGET_GROW`      | To adjust the relative size of the Storage widget         | number  | `3.5`         |
| `DASHDOT_STORAGE_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Storage widget (in px) | number  | `500`         |
| `DASHDOT_STORAGE_POLL_INTERVAL`    | Read the Storage load every x milliseconds                | number  | `60000`       |

<!-- markdownlint-enable -->

## RAM Widget

<!-- markdownlint-disable -->

| Variable                       | Description                                              | Type    | Default Value |
| ------------------------------ | -------------------------------------------------------- | ------- | ------------- |
| `DASHDOT_RAM_WIDGET_ENABLE`    | To show/hide the Memory widget                           | boolean | `true`        |
| `DASHDOT_RAM_WIDGET_GROW`      | To adjust the relative size of the Memory widget         | number  | `4`           |
| `DASHDOT_RAM_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Memory widget (in px) | number  | `500`         |
| `DASHDOT_RAM_DATAPOINTS`       | The amount of datapoints in the Memory graph             | number  | `20`          |
| `DASHDOT_RAM_POLL_INTERVAL`    | Read the Memory load every x milliseconds                | number  | `1000`        |

<!-- markdownlint-enable -->

## Network Widget

<!-- markdownlint-disable -->

| Variable                           | Description                                               | Type    | Default Value |
| ---------------------------------- | --------------------------------------------------------- | ------- | ------------- |
| `DASHDOT_NETWORK_WIDGET_ENABLE`    | To show/hide the Network widget                           | boolean | `true`        |
| `DASHDOT_NETWORK_WIDGET_GROW`      | To adjust the relative size of the Network widget         | number  | `6`           |
| `DASHDOT_NETWORK_WIDGET_MIN_WIDTH` | To adjust the minimum width of the Network widget (in px) | number  | `500`         |
| `DASHDOT_NETWORK_DATAPOINTS`       | The amount of datapoints in each of the Network graphs    | number  | `10`          |
| `DASHDOT_NETWORK_POLL_INTERVAL`    | Read the Network load every x milliseconds                | number  | `1000`        |

<!-- markdownlint-enable -->

## Overrides

Override specific fields, by providing your desired value with the following options.

<!-- markdownlint-disable -->

| Variable                                   | Description                                                                                                                                                           | Type   | Default Value |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- |
| `DASHDOT_OVERRIDE_OS`                      |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_ARCH`                    |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_CPU_BRAND`               |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_CPU_MODEL`               |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_CPU_CORES`               |                                                                                                                                                                       | number |
| `DASHDOT_OVERRIDE_CPU_THREADS`             |                                                                                                                                                                       | number |
| `DASHDOT_OVERRIDE_CPU_FREQUENCY`           | Number needs to be passed in GHz (e.g. `2.8`)                                                                                                                         | number |
| `DASHDOT_OVERRIDE_RAM_BRAND`               |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_RAM_SIZE`                | Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`)                                                            | number |
| `DASHDOT_OVERRIDE_RAM_TYPE`                |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_RAM_FREQUENCY`           |                                                                                                                                                                       | number |
| `DASHDOT_OVERRIDE_NETWORK_TYPE`            |                                                                                                                                                                       | string |
| `DASHDOT_OVERRIDE_NETWORK_SPEED_UP`        | Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)                                                                   | number |
| `DASHDOT_OVERRIDE_NETWORK_SPEED_DOWN`      | Number needs to be passed in bit (e.g. `100000000` for 100 Mb/s, because it is `100 * 1000 * 1000`)                                                                   | number |
| `DASHDOT_OVERRIDE_NETWORK_INTERFACE_SPEED` | Number needs to be passed in Megabit (e.g. `10000` for 10 GB/s, because it is `10 * 1000`)                                                                            | number |
| `DASHDOT_OVERRIDE_STORAGE_BRAND_[1-5]`     | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives                                                                                                             | string |
| `DASHDOT_OVERRIDE_STORAGE_SIZE_[1-5]`      | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives. Number needs to be passed in bytes (e.g. `34359738368` for 32 GB, because it is `32 * 1024 * 1024 * 1024`) | number |
| `DASHDOT_OVERRIDE_STORAGE_TYPE_[1-5]`      | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives                                                                                                             | string |

<!-- markdownlint-enable -->
