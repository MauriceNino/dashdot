---
tags:
  - Installation
  - Docker
---

# Installation

## Quick Setup

Images are hosted on [DockerHub](https://hub.docker.com/r/mauricenino/dashdot),
and are available for both AMD64 and ARM devices.

```bash
docker container run -it \
  -p 80:3001 \
  -v /etc/os-release:/etc/os-release:ro \
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \
  -v /media:/mnt/host_media:ro \
  -v /mnt:/mnt/host_mnt:ro \
  --privileged \
  mauricenino/dashdot
```

:::info

- The `--privileged` flag is needed to correctly determine the memory and storage info.

- The volume mount on `/etc/os-release:/etc/os-release:ro` is for the
  dashboard to show the OS version of the host instead of the OS of the docker
  container (which is running on Alpine Linux). If you wish to show the docker
  container OS instead, just remove this line. If you are not able to use this
  mount, you can pass a custom OS with the `DASHDOT_OVERRIDE_OS` flag.

- The volume mount on `/proc/1/ns/net:/host_ns_net:ro` is needed to
  correctly determine the network info. If you are not able to use this mount,
  you will need to fall back to `--net host`, or you will only get the network
  stats of the container instead of the host.

- The volume mounts on `/media:/mnt/host_media:ro` and `/mnt:/mnt/host_mnt:ro`
  are needed to read the usage stats of all drives. If your drives are mounted somewhere
  else, you need to pass that drive path with the following format: `-v /{path}:/mnt/host_{path}:ro`.

:::

## Installation Options

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
