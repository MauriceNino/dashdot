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
  -v /:/mnt/host:ro \
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

> **Note:** GPU support is not available on ARM devices.

```bash
docker container run -it \
  -p 80:3001 \
  --privileged \
  --gpus all \
  -v /:/mnt/host:ro \
  mauricenino/dashdot:gpu
```
