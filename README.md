<h1><img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/banner_muted.png?raw=true" alt="dash. - a modern server dashboard"></h1>
<p align="center">
  <b>dash.</b> (or <b>dashdot</b>) is a modern server dashboard, developed with a simple, but performant stack and designed with glassmorphism in mind. <br>
<br>
It is intended to be used for smaller VPS and private servers.
</p>
<p align="center">
  <a href="https://dash.mauz.io">Live Demo</a>
 |
  <a href="https://hub.docker.com/repository/docker/mauricenino/dashdot">Docker Image</a>
 |
  <a href="https://www.npmjs.com/package/dashdot-cli">Node Package</a>
</p>

---

- [Preview](#Preview)
- [Installation](#Installation)
- [Configuration](#Configuration)
- [Contributing](#Contributing)

**dash.** is a open-source project, so any contribution is highly appreciated. If you are interested in further developing this project, have a look at the [Contributing](#Contributing) section of this readme.

In case you want to financially support this project, you can [donate here](https://paypal.me/itsMaurice).

# Preview

Darkmode | Lightmode
-- | --
<img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/screenshot_darkmode.png?raw=true" alt="screenshot of the darkmode"> | <img src="https://github.com/MauriceNino/dashdot/blob/master/_doc/screenshot_lightmode.png?raw=true" alt="screenshot of the lightmode">

# Installation

Choose one of the following three ways to get your dashboard up and running

## Docker

Images are hosted on [docker.io](https://hub.docker.com/repository/docker/mauricenino/dashdot), so you can easily use them with `docker` or other container engines

```bash
> docker container run -it \
  -p 3001:3001 \
  --name dashboard \
  mauricenino/dashdot
```

**Configuration**

You can configure your Docker-installed dashboard via environment variables inside the container. 
You can pass them by specifying them in your custom Dockerfile, or via the `--env` flag.

```bash
> docker container run -it \
  --env DASHDOT_PORT 80 \
  -p 3001:80 \
  --name dashboard \
  mauricenino/dashdot
```

To read more about configuration options, you cam visit [the configuration section](#Configuration).

## Node

The package is hosted as an executable on [npmjs.com](https://www.npmjs.com/package/dashdot-cli), so you can run it via `npx`

```bash
> npx dashdot-cli
```

**Configuration**

You can configure your Node-installed dashboard via environment variables, or by passing command-line arguments.
Alternatively, you can also pass your config via CLI arguments.


```bash
> export DASHDOT_PORT=80
> npx dashdot-cli
```

or

```bash
> npx dashdot-cli DASHDOT_PORT=80
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
> yarn start
```

**Configuration**

You can configure your Git-installed dashboard via environment variables. 

```bash
> export DASHDOT_PORT=80
> yarn start
```

To read more about configuration options, you cam visit [the configuration section](#Configuration).

# Configuration Options

The following configuration options are available.

If you dont know how to set them, look up the section for your type of installment (Docker, Node or Git).

Variable | Description | Default Value
-- | -- | --
DASHDOT_PORT | The port where the express backend is running (the backend serves the frontend, so it is the same port for both) | 3001

# Contributing

The simplest way of contributing is to create [a new issue](https://github.com/MauriceNino/dashdot/issues) with a feature-request or bug-report.

If you are able to, you can also create a [pull request](https://github.com/MauriceNino/dashdot/pulls) to add the wanted features or fix the found bug.

To start working on this project, you can start by going through the Install - Git guide, but omit the `yarn start` part.
When done, you can run the project in dev-mode using `yarn run dev`. This will start the express backend using `nodemon` and the react frontend using `create-react-app`.

## Stack for contributing

- [Typescript](https://github.com/microsoft/TypeScript)
- [Socket.io](https://github.com/socketio/socket.io)

**Backend**

- [Express](https://github.com/expressjs/express)
- [Rxjs](https://github.com/ReactiveX/rxjs)

**Frontend**

- [React](https://github.com/facebook/react)
- [Styled Components](https://github.com/styled-components/styled-components)
- [Antd](https://github.com/ant-design/ant-design/)
- [Nivo](https://github.com/plouc/nivo)
- [Fontawesome](https://github.com/FortAwesome/Font-Awesome)