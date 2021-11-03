<h1><img src="_doc/banner_muted.png" alt="dash. - a modern server dashboard"></h1>
<p align="center">
  <b>dash.</b> (or <b>dashdot</b>) is a modern server dashboard, developed with a simple, but performant stack and designed with glassmorphism in mind. <br>
<br>
It is intended to be used for smaller VPS and private servers.
</p>
<p align="center">
  <a href="https://dash.mauz.io">Live Demo</a>
 |
  <a href="#">Docker Image</a>
 |
  <a href="#">Node Package</a>
</p>

---

- [Installation](#Installation)
- [Configuration](#Configuration)
- [Contributing](#Contributing)

**dash.** is a open-source project, so any contribution is highly appreciated. If you are interested in further developing this project, have a look at the [Contributing](#Contributing) section of this readme.

In case you want to financially support this project, you can [donate here](https://paypal.me/itsMaurice).

# Installation

Choose one of the following three ways to get your dashboard up and running

## Docker

Images are hosted on docker.io, so you can easily use them with `docker` or other container engines

```bash
docker container run -it --name dashboard mauricenino/dashdot
```

## Node

The package is hosted as an executable on npmjs.com, so you can run it via `npx`

```bash
npx dashdot-cli
```

## Git

To download the repository and run it yourself, there are a few steps necessary:

If you have not already installed yarn, install it now:

```
npm i -g yarn
```

After that, download and build the project (might take a few minutes)

```
git clone https://github.com/MauriceNino/dashdot \
  && cd dashdot \
  && yarn \
  && yarn build
```

When done, you can run the dashboard by executing:

```
yarn start
```

# Configuration (TBD)

The configuration is done via environment variables, so to change the config, you have to either set the environment variables in your docker image (or during startup), or provide a `.env` file.

The following configuration options are available.

Variable | Description | Default Value
-- | -- | --
DASHDOT_PORT | The port where the express backend is running | 3001

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