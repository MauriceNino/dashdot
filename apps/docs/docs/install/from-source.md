---
sidebar_position: 3
description: How to install and configure dash. from source
tags:
  - Installation
  - Configuration
  - Source
---

# From Source

## Prerequisites

To run this repository from source, you need to have the following installed:

- [node.js](https://nodejs.org/) (recommended version 18.x)
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)
- [speedtest](https://www.speedtest.net/apps/cli) (recommended)
- or alternatively: [speedtest-cli](https://github.com/sivel/speedtest-cli)

## Setup

After that, download and build the project (might take a few minutes)

```bash
git clone https://github.com/MauriceNino/dashdot &&\
  cd dashdot &&\
  yarn &&\
  yarn build:prod
```

When done, you can run the dashboard by executing:

```bash
sudo -E yarn start
```

:::info

In case you get a speedtest related error, you might have to accept the license
before being able to start your dashboard.

For this, run the following in your terminal:

```bash
speedtest --accept-license
```

:::

## Configuration

Config options can optionally passed using environment variables.

```bash
export DASHDOT_PORT="8080" &&\
  sudo -E yarn start
```
