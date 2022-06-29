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
      - /etc/os-release:/etc/os-release:ro
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
