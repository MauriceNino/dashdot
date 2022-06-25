---
sidebar_position: 1
---

# General

## `DASHDOT_PORT`

The port where the express backend is running (the backend serves the frontend, so it is the same port for both).

- type: `number`
- default: `3001`

## `DASHDOT_WIDGET_LIST`

Change the order of the elements in the list, to change the position on the page, or remove an item from the list, to remove it from the page (The available options are: `os`, `cpu`, `storage`, `ram`, `network`, `gpu`).

- type: `string`
- default: `os,cpu,storage,ram,network`

## `DASHDOT_ACCEPT_OOKLA_EULA`

Use the newer and more accurate `speedtest` tool from Ookla, instead of the old `speedtest-cli` for your speedtests.
When passing this flag, you accept Ooklas: [EULA](https://www.speedtest.net/about/eula), [TERMS](https://www.speedtest.net/about/terms) and [PRIVACY](https://www.speedtest.net/about/privacy).

- type: `boolean`
- default: `false`

## `DASHDOT_USE_IMPERIAL`

Shows any units in the imperial system, instead of the default metric

- type: `boolean`
- default: `false`

## `DASHDOT_DISABLE_INTEGRATIONS`

Disables support for integrations. This does two things: disable CORS and disable open API endpoints.

- type: `boolean`
- default: `false`
