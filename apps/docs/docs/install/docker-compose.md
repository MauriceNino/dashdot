---
sidebar_position: 2
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
      - /proc/1/ns/net:/mnt/host_ns_net:ro
      - /media:/mnt/host_media:ro
      - /mnt:/mnt/host_mnt:ro
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
