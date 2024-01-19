---
sidebar_position: 2
description: How to install and configure dash. using docker-compose
tags:
  - Installation
  - Configuration
  - Docker
  - Docker-Compose
---

# Docker-Compose

```yml
version: '3.5'

services:
  dash:
    image: mauricenino/dashdot:latest
    restart: unless-stopped
    privileged: true
    ports:
      - '80:3001'
    volumes:
      - /:/mnt/host:ro
```

## Configuration

Config options can optionally set, by using the [environment](https://docs.docker.com/compose/compose-file/#environment) field.

```yml
services:
  dash:
    environment:
      DASHDOT_ENABLE_CPU_TEMPS: 'true'
    # ...
```

## GPU Support

GPU support is available with another image tag and a slightly different config.

> **Note:** GPU support is not available on ARM devices.

```yml
version: '3.5'

services:
  dash:
    image: mauricenino/dashdot:gpu
    restart: unless-stopped
    privileged: true
    deploy:
      resources:
        reservations:
          devices:
            - capabilities:
                - gpu
    ports:
      - '80:3001'
    volumes:
      - /:/mnt/host:ro
```
