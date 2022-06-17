---
sidebar_position: 3
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
  yarn build
```

When done, you can run the dashboard by executing:

```bash
sudo yarn start
```

## Configuration

Config options can optionally passed using environment variables.

```bash
export DASHDOT_PORT="8080" &&\
  sudo yarn start
```
