---
sidebar_position: 4
---

# Storage Widget

## `DASHDOT_ENABLE_STORAGE_SPLIT_VIEW`

If you want to enable an optional split view for the storage widget, set this to `true`.

The split view will only work reliably, if all drives are mounted in the container.
Otherwise, any unassigned space will be attributed to the host drive.

- type: `boolean`
- default: `false`

## `DASHDOT_STORAGE_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `size`, `type`).

- type: `string`
- default: `brand,size,type`

## `DASHDOT_STORAGE_WIDGET_GROW`

To adjust the relative size of the Storage widget.

- type: `number`
- default: `3.5`

## `DASHDOT_STORAGE_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Storage widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_STORAGE_POLL_INTERVAL`

Read the Storage load every x milliseconds.

- type: `number`
- default: `60000`
