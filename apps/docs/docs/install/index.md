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
  -v /:/mnt/host:ro \
  --privileged \
  mauricenino/dashdot
```

:::info

- The `--privileged` flag is needed to correctly determine the memory and storage info.

- The volume mounts on `/:/mnt/host:ro` is needed to read the usage stats of all drives,
  read the network usage and read the os version of the host. If you don't like to use this
  mount, feel free to check out the [help page](../help.md#qa) to find a guide on how to set it up manually.

:::

:::warning

The speed testing feature can consume significant amounts of bandwidth, which can pose
problems if your usage is metered (say, by a VPS provider).

Setting the environment variable [`DASHDOT_SPEED_TEST_INTERVAL`](./config/widget-specific/network#dashdot_speed_test_interval)
to a higher number can mitigate this concern.

:::

## Installation Options

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
