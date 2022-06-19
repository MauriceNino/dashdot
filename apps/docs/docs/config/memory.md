---
sidebar_position: 5
---

# RAM Widget

## `DASHDOT_RAM_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `size`, `type`, `frequency`).

- type: `string`
- default: `brand,size,type,frequency`

## `DASHDOT_RAM_WIDGET_GROW`

To adjust the relative size of the Memory widget.

- type: `number`
- default: `4`

## `DASHDOT_RAM_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Memory widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_RAM_DATAPOINTS`

The amount of datapoints in the Memory graph.

- type: `number`
- default: `20`

## `DASHDOT_RAM_POLL_INTERVAL`

Read the Memory load every x milliseconds.

- type: `number`
- default: `1000`
