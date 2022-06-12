# Installation Options

To read more about configuration options, you can visit the [CONFIGURATION.md](./CONFIGURATION.md).

## Docker

```bash
# Config options can optionally passed using the --env flag.
# e.g: --env DASHDOT_ENABLE_CPU_TEMPS "true"

docker container run -it \
  -p 80:3001 \
  --privileged \
  -v /etc/os-release:/etc/os-release:ro \
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \
  -v /media:/mnt/host_media:ro \
  -v /mnt:/mnt/host_mnt:ro \
  mauricenino/dashdot
```

> Note: The `--privileged` flag is needed to correctly determine the memory and storage info.

<!-- -->

> Note: The volume mount on `/etc/os-release:/etc/os-release:ro` is for the
> dashboard to show the OS version of the host instead of the OS of the docker
> container (which is running on Alpine Linux). If you wish to show the docker
> container OS instead, just remove this line. If you are not able to use this
> mount, you can pass a custom OS with the `DASHDOT_OVERRIDE_OS` flag.

<!-- -->

> Note: The volume mount on `/proc/1/ns/net:/host_ns_net:ro` is needed to
> correctly determine the network info. If you are not able to use this mount,
> you will need to fall back to `--net host`, or you will only get the network
> stats of the container instead of the host.

<!-- -->

> Note: The volume mounts on `/media:/mnt/host_media:ro` and `/mnt:/mnt/host_mnt:ro`
> are needed to read the usage stats of all drives. If your drives are mounted somewhere
> else, you need to pass that drive path with the following format: `-v /{path}:/mnt/host_{path}:ro`.

## Docker-Compose

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
    ports:
      - '80:3001'
    volumes:
      - /etc/os-release:/etc/os-release:ro
      - /proc/1/ns/net:/mnt/host_ns_net:ro
      - /media:/mnt/host_media:ro
      - /mnt:/mnt/host_mnt:ro
```

## From Source

### Prerequisites

To run this repository from source, you need to have the following installed:

- [node.js](https://nodejs.org/) (recommended version 18.x)
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)
- [speedtest](https://www.speedtest.net/apps/cli) (recommended)
- or alternatively: [speedtest-cli](https://github.com/sivel/speedtest-cli)

### Setup

After that, download and build the project (might take a few minutes)

```bash
git clone https://github.com/MauriceNino/dashdot &&\
  cd dashdot &&\
  yarn &&\
  yarn build
```

When done, you can run the dashboard by executing:

```bash
# Config options can optionally passed using environment variables.
# e.g: export DASHDOT_PORT="8080"

sudo yarn start
```
