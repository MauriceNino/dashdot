---
sidebar_position: 5
tags:
  - Configuration
  - Styles
title: Network
---

<!-- markdownlint-disable -->

# Network Widget

<!-- markdownlint-enable -->

## `DASHDOT_SPEED_TEST_INTERVAL`

At which interval the network speed-test should be rerun (in minutes).

- type: `number`
- default: `240` (every 4 hours)

## `DASHDOT_SPEED_TEST_INTERVAL_CRON`

At which interval the network speed-test should be rerun, passed as a cron string.
This setting overrides `DASHDOT_SPEED_TEST_INTERVAL` if set.

Example: `0 0 * * *` (every day at midnight)

- type: `string`
- default: `unset`

## `DASHDOT_NETWORK_WIDGET_GROW`

To adjust the relative size of the Network widget.

- type: `number`
- default: `6`

## `DASHDOT_NETWORK_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Network widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_NETWORK_SHOWN_DATAPOINTS`

The amount of datapoints in each of the Network graphs.

- type: `number`
- default: `20`

## `DASHDOT_NETWORK_POLL_INTERVAL`

Read the Network load every x milliseconds.

- type: `number`
- default: `1000`
