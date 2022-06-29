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
  -v /:/mnt/host:ro \
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

- The volume mounts on `/:/mnt/host:ro` is needed to read the usage stats of all drives and also
  for reading the correct network stats.

:::

## Installation Options

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
