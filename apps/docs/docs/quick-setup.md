---
sidebar_position: 1
---

# Quick Setup

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

To get more information on why which flag is needed, or if you want to use other
install options instead (`docker-compose`, or from source), have a look at the [installation section](./install/docker).
