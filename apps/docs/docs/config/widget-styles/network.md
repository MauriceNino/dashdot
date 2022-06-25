---
sidebar_position: 5
tags:
  - Configuration
  - Styles
---

# Network Widget

## `DASHDOT_SPEED_TEST_INTERVAL`

At which interval the network speed-test should be rerun (in minutes).

- type: `number`
- default: `60`

## `DASHDOT_NETWORK_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `type`, `speed_up`, `speed_down`, `interface_speed`, `public_ip`).

- type: `string`
- default: `type,speed_up,speed_down,interface_speed`

## `DASHDOT_NETWORK_WIDGET_GROW`

To adjust the relative size of the Network widget.

- type: `number`
- default: `6`

## `DASHDOT_NETWORK_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Network widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_NETWORK_DATAPOINTS`

The amount of datapoints in each of the Network graphs.

- type: `number`
- default: `20`

## `DASHDOT_NETWORK_POLL_INTERVAL`

Read the Network load every x milliseconds.

- type: `number`
- default: `1000`
