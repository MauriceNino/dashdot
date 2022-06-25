---
tags:
  - Configuration
---

# Configuration Options

The following configuration options are available and can be passed as environment variables.

If you don't know how to set them, look up the section for your type of installment
in the [installation section](/docs/install).

## `DASHDOT_PORT`

The port where the express backend is running (the backend serves the frontend, so it is the same port for both).

- type: `number`
- default: `3001`

## `DASHDOT_DISABLE_HOST`

If you want to hide the host part in the server widget (e.g. `dash.mauz.io` -> `dash.`).

- type: `boolean`
- default: `false`

## `DASHDOT_WIDGET_LIST`

Change the order of the elements in the list, to change the position on the page, or remove an item from the list, to remove it from the page (The available options are: `os`, `cpu`, `storage`, `ram`, `network`, `gpu`).

- type: `string`
- default: `os,cpu,storage,ram,network`

## `DASHDOT_ENABLE_CPU_TEMPS`

If you want to show the CPU temperature in the graph. This will probably not work on a VPS, so you need to try it on your own if this works. For home servers it might work just fine.

- type: `boolean`
- default: `false`

## `DASHDOT_ENABLE_STORAGE_SPLIT_VIEW`

If you want to enable an optional split view for the storage widget, set this to `true`.

The split view will only work reliably, if all drives are mounted in the container.
Otherwise, any unassigned space will be attributed to the host drive.

- type: `boolean`
- default: `false`

## `DASHDOT_ACCEPT_OOKLA_EULA`

Use the newer and more accurate `speedtest` tool from Ookla, instead of the old `speedtest-cli` for your speedtests.
When passing this flag, you accept Ooklas: [EULA](https://www.speedtest.net/about/eula), [TERMS](https://www.speedtest.net/about/terms) and [PRIVACY](https://www.speedtest.net/about/privacy).

- type: `boolean`
- default: `false`

## `DASHDOT_USE_NETWORK_INTERFACE`

If dash. detects the wrong gateway as your default interface, you can provide a name here that is used instead.

- type: `string`
- default: `unset`

## `DASHDOT_USE_IMPERIAL`

Shows any units in the imperial system, instead of the default metric

- type: `boolean`
- default: `false`

## `DASHDOT_DISABLE_INTEGRATIONS`

Disables support for integrations. This does two things: disable CORS and disable open API endpoints.

- type: `boolean`
- default: `false`

## Style Options for different cards

```mdx-code-block
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
```
