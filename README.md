<!-- markdownlint-disable -->
<h1>
  <img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/banner_muted.png?raw=true" alt="dash. - a modern server dashboard">
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

## Content

- [Preview](#Preview)
- [Installation](#Installation)
- [Configuration](#Configuration-Options)
- [Contributing](#Contributing)

**dash.** is a open-source project, so any contribution is highly appreciated.
If you are interested in further developing this project, have a look at the
[Contributing](#Contributing) section of this readme.

In case you want to financially support this project, you can [donate here](https://paypal.me/itsMaurice).

# Preview

<!-- markdownlint-disable -->
Darkmode | Lightmode
-- | --
<img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/screenshot_darkmode.png?raw=true" alt="screenshot of the darkmode"> | <img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/screenshot_lightmode.png?raw=true" alt="screenshot of the lightmode">
<!-- markdownlint-enable -->

# Installation

You can run dashdot from a docker container, or build it yourself.

## Docker

Images are hosted on
[docker.io](https://hub.docker.com/repository/docker/mauricenino/dashdot),
so you can easily use them with `docker` or other container engines

```bash
> docker container run -it \
  -p 80:3001 \
  --privileged \
  --name dashdot \
  mauricenino/dashdot
```

> Note: The `--privileged` flag is needed to correctly determine the memory info.

You can configure your Docker-installed dashboard via environment variables
inside the container.
You can pass them by specifying them in your custom Dockerfile, or via the
`--env` flag.

```bash
> docker container run -it \
  -p 80:3001 \
  --privileged \
  --env DASHDOT_OVERRIDE_DISTRO "Ubuntu" \
  --name dashdot \
  mauricenino/dashdot
```

To read more about configuration options, you cam visit [the configuration section](#Configuration).

## Git

To download the repository and run it yourself, there are a few steps necessary:

If you have not already installed yarn, install it now:

```bash
> npm i -g yarn
```

After that, download and build the project (might take a few minutes)

```bash
> git clone https://github.com/MauriceNino/dashdot \
  && cd dashdot \
  && yarn \
  && yarn build
```

When done, you can run the dashboard by executing:

```bash
> sudo yarn start
```

You can configure your Git-installed dashboard via environment variables.

```bash
> export DASHDOT_OVERRIDE_DISTRO="Ubuntu"
> yarn start
```

To read more about configuration options, you cam visit [the configuration section](#Configuration-Options).

# Configuration Options

The following configuration options are available.

If you dont know how to set them, look up the section for your type of installment
(Docker or Git).

<!-- markdownlint-disable -->
Variable | Description | Type | Default Value
-- | -- | -- | --
DASHDOT_PORT | The port where the express backend is running (the backend serves the frontend, so it is the same port for both) | number | `3001`
DASHDOT_OVERRIDE_DISTRO | The distro of the host OS (shown in field "OS" and used for image) | string |
DASHDOT_OVERRIDE_RELEASE | The release version of the host OS (shown in field "OS") | string |
DASHDOT_OVERRIDE_PLATFORM | The platform (e.g. "darwin") of the host OS (used for image) | string |
DASHDOT_OVERRIDE_ARCH | | string |
DASHDOT_OVERRIDE_CPU_BRAND | | string |
DASHDOT_OVERRIDE_CPU_MODEL | | string |
DASHDOT_OVERRIDE_CPU_CORES | | number |
DASHDOT_OVERRIDE_CPU_THREADS | | number |
DASHDOT_OVERRIDE_CPU_FREQUENCY | | number |
DASHDOT_OVERRIDE_RAM_BRAND | | string |
DASHDOT_OVERRIDE_RAM_SIZE | | number |
DASHDOT_OVERRIDE_RAM_TYPE | | string |
DASHDOT_OVERRIDE_RAM_SPEED | | number |
DASHDOT_OVERRIDE_STORAGE_VENDOR_[1 - 5] | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives | string |
DASHDOT_OVERRIDE_STORAGE_CAPACITY_[1 - 5] | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives | number |
DASHDOT_OVERRIDE_STORAGE_TYPE_[1 - 5] | Use a suffix of 1, 2, 3, 4 or 5 for the respective drives | string |
<!-- markdownlint-enable -->

# Contributing

The simplest way of contributing is to create
[a new issue](https://github.com/MauriceNino/dashdot/issues) with a
feature-request or bug-report.

If you are able to, you can also create a
[pull request](https://github.com/MauriceNino/dashdot/pulls) to add the wanted
features or fix the found bug.

To start working on this project, you can start by going through the
Install - Git guide, but omit the `yarn start` part.
When done, you can run the project in dev-mode using `yarn run dev`.
This will start the express backend using `nodemon` and the
react frontend using `create-react-app`.

## Stack for contributing

- [Typescript](https://github.com/microsoft/TypeScript)
- [Socket.io](https://github.com/socketio/socket.io)

### Backend

- [Express](https://github.com/expressjs/express)
- [Rxjs](https://github.com/ReactiveX/rxjs)

### Frontend

- [React](https://github.com/facebook/react)
- [Styled Components](https://github.com/styled-components/styled-components)
- [Antd](https://github.com/ant-design/ant-design/)
- [Nivo](https://github.com/plouc/nivo)
- [Fontawesome](https://github.com/FortAwesome/Font-Awesome)
