<!-- markdownlint-disable -->
<h1>
  <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/banner_muted.png?raw=true" alt="dash. - a modern server dashboard">
</h1>

<div align="center">
  <a href="https://drone.mauz.io/MauriceNino/dashdot" target="_blank">
    <img src="https://drone.mauz.io/api/badges/MauriceNino/dashdot/status.svg">
  </a>
</div>

<br/>
<br/>

<p align="center">
  <b>dash.</b> (or <b>dashdot</b>) is a modern server dashboard, developed with a simple, but performant stack and designed with glassmorphism in mind. <br>
  <br>
  It is intended to be used for smaller VPS and private servers.
</p>
<p align="center">
  <a href="https://dash.mauz.io" target="_blank">Live Demo</a>
 |
  <a href="https://hub.docker.com/r/mauricenino/dashdot" target="_blank">Docker Image</a>
</p>

#

<!-- markdownlint-enable -->

**dash.** is a open-source project, so any contribution is highly appreciated.
If you are interested in further developing this project, have a look at the
[Contributing.md](./CONTRIBUTING.md).

In case you want to financially support this project, you can visit my
[GitHub Sponsors](https://github.com/sponsors/MauriceNino), or my [Ko-Fi](https://ko-fi.com/mauricenino).

## Preview

<!-- markdownlint-disable -->

| Darkmode                                                                                                                                      | Lightmode                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/screenshot_darkmode.png?raw=true" alt="screenshot of the darkmode"> | <img src="https://github.com/MauriceNino/dashdot/blob/main/.github/images/screenshot_lightmode.png?raw=true" alt="screenshot of the lightmode"> |

<!-- markdownlint-enable -->

## Installation

### Docker

Images are hosted on [DockerHub](https://hub.docker.com/r/mauricenino/dashdot),
and are available for both AMD64 and ARM devices.

To read more about configuration options, you can visit [the CONFIGURATION.md](./CONFIGURATION.md).

```bash
# Config options can optionally passed using the --env flag.
# e.g: --env DASHDOT_ENABLE_CPU_TEMPS "true"

docker container run -it \
  -p 80:3001 \
  -v /etc/os-release:/etc/os-release:ro \
  -v /proc/1/ns/net:/mnt/host_ns_net:ro \
  --privileged \
  mauricenino/dashdot
```

> Note: The `--privileged` flag is needed to correctly determine the memory info.

<!-- -->

> Note: The volume mount on `/proc/1/ns/net:/host_ns_net:ro` is needed to
> correctly determine the network info. If you are not able to use this mount,
> you will need to fall back to `--net host`, or you will only get the network
> stats of the container instead of the host.

<!-- -->

> Note: The volume mount on `/etc/os-release:/etc/os-release:ro` is for the
> dashboard to show the OS version of the host instead of the OS of the docker
> container (which is running on Alpine Linux). If you wish to show the docker
> container OS instead, just remove this line. If you are not able to use this
> mount, you can pass a custom OS with the `DASHDOT_OVERRIDE_OS` flag.

### Docker-Compose

</summary>

To read more about configuration options, you can visit [the CONFIGURATION.md](./CONFIGURATION.md).

```yml
version: '3.5'

# Config options can optionally set, by using the environment field.
# e.g:
#   environment:
#     DASHDOT_ENABLE_CPU_TEMPS: "true"

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
```

### Git

To download the repository and run it yourself, there are a few steps necessary:

If you have not already installed yarn, install it now:

```bash
npm i -g yarn
```

After that, download and build the project (might take a few minutes)

```bash
git clone https://github.com/MauriceNino/dashdot &&\
  cd dashdot &&\
  yarn &&\
  yarn build
```

When done, you can run the dashboard by executing:

```bash
# Config options can optionally passed using environment variables.
# e.g: export DASHDOT_PORT="8080"

sudo yarn start
```

> Note: To measure network speed, it is suggested to install the `speedtest-cli`
> package on your machine (e.g. `sudo apt install speedtest-cli` on Ubuntu).

To read more about configuration options, you can visit [the CONFIGURATION.md](./CONFIGURATION.md).
