---
sidebar_position: 1
description: How to install and configure dash. using docker
tags:
  - Installation
  - Configuration
  - Docker
---

# Docker

```bash
docker container run -it \
  -p 80:3001 \
  --privileged \
  -v /etc/os-release:/etc/os-release:ro \
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \
  -v /media:/mnt/host_media:ro \
  -v /mnt:/mnt/host_mnt:ro \
  mauricenino/dashdot
```

## Configuration

Config options can optionally passed using the
[`--env`](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
flag.

```bash
docker container run -it \
  --env DASHDOT_ENABLE_CPU_TEMPS "true" \
  # ...
```
