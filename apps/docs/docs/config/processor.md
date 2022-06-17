---
sidebar_position: 3
---

# CPU Widget

## `DASHDOT_ENABLE_CPU_TEMPS`

If you want to show the CPU temperature in the graph. This will probably not work on a VPS, so you need to try it on your own if this works. For home servers it might work just fine.

- type: `boolean`
- default: `false`

## `DASHDOT_CPU_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `model`, `cores`, `threads`, `frequency`).

- type: `string`
- default: `brand,model,cores,threads,frequency`

## `DASHDOT_CPU_WIDGET_GROW`

To adjust the relative size of the Processor widget.

- type: `number`
- default: `4`

## `DASHDOT_CPU_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Processor widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_CPU_DATAPOINTS`

The amount of datapoints in the Processor graph.

- type: `number`
- default: `20`

## `DASHDOT_CPU_POLL_INTERVAL`

Read the Processor load every x milliseconds.

- type: `number`
- default: `1000`
