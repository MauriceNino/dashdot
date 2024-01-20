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
  -v /:/mnt/host:ro \
  --privileged \
  mauricenino/dashdot
```

## Configuration

Config options can optionally passed using the
[`--env`](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
flag.

```bash
docker container run -it \
  --env DASHDOT_ENABLE_CPU_TEMPS="true" \
  # ...
```

## GPU Support

GPU support is available with another image tag and a slightly different command.

```bash
docker container run -it \
  -p 80:3001 \
  -v /:/mnt/host:ro \
  --privileged \
  --gpus all \
  --env DASHDOT_WIDGET_LIST="os,cpu,storage,ram,network,gpu"
  mauricenino/dashdot:nvidia
```
