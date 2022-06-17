---
sidebar_position: 2
---

# Server Widget

## `DASHDOT_DISABLE_HOST`

If you want to hide the host part in the server widget (e.g. `dash.mauz.io` -> `dash.`).

- type: `boolean`
- default: `false`

## `DASHDOT_OS_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `os`, `arch`, `up_since`).

- type: `string`
- default: `os,arch,up_since`

## `DASHDOT_OS_WIDGET_GROW`

To adjust the relative size of the OS widget.

- type: `number`
- default: `1.5`

## `DASHDOT_OS_WIDGET_MIN_WIDTH`

To adjust the minimum width of the OS widget (in px).

- type: `number`
- default: `300`
