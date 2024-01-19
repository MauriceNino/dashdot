---
sidebar_position: 6
tags:
  - Configuration
  - Styles
title: Graphics
---

<!-- markdownlint-disable -->

# GPU Widget

<!-- markdownlint-enable -->

To use the GPU widget, make sure to include it in the `DASHDOT_WIDGET_LIST`.
Also, if you are running the docker image, make sure to use the `nvidia` tag
(see [Installation with Docker](/docs/install/docker#gpu-support)).

## `DASHDOT_GPU_WIDGET_GROW`

To adjust the relative size of the GPU widget.

- type: `number`
- default: `6`

## `DASHDOT_GPU_WIDGET_MIN_WIDTH`

To adjust the minimum width of the GPU widget (in px).

- type: `number`
- default: `700`

## `DASHDOT_GPU_SHOWN_DATAPOINTS`

The amount of datapoints in the GPU graph.

- type: `number`
- default: `20`

## `DASHDOT_GPU_POLL_INTERVAL`

Read the GPU load every x milliseconds.

- type: `number`
- default: `1000`
