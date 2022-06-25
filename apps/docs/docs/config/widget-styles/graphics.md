---
sidebar_position: 6
tags:
  - Configuration
  - Styles
---

# GPU Widget

To use the GPU widget, make sure to include it in the `DASHDOT_WIDGET_LIST`. One
limitation with the GPU widget is that it will **only run out of the box with from
source installations**. Docker images do not include the necessary tools (mainly,
because I don't want to bloat the image for everyone). If you absolutely need the
GPU widget running inside a docker container, you will need to create your own image.

These links might help you with that:

- <https://www.howtogeek.com/devops/how-to-use-an-nvidia-gpu-with-docker-containers/>
- <https://docs.docker.com/compose/gpu-support/>
- <https://towardsdatascience.com/how-to-properly-use-the-gpu-within-a-docker-container-4c699c78c6d1>
- <https://stackoverflow.com/q/25185405/9150652>
- <https://stackoverflow.com/q/63751883/9150652>

## `DASHDOT_GPU_LABEL_LIST`

Change the order of the labels in the list, to change the position in the widget, or remove an item from the list, to remove it from the widget (The available options are: `brand`, `model`, `memory`).

- type: `string`
- default: `brand, model, memory`

## `DASHDOT_GPU_WIDGET_GROW`

To adjust the relative size of the GPU widget.

- type: `number`
- default: `6`

## `DASHDOT_GPU_WIDGET_MIN_WIDTH`

To adjust the minimum width of the GPU widget (in px).

- type: `number`
- default: `700`

## `DASHDOT_GPU_DATAPOINTS`

The amount of datapoints in the GPU graph.

- type: `number`
- default: `20`

## `DASHDOT_GPU_POLL_INTERVAL`

Read the GPU load every x milliseconds.

- type: `number`
- default: `1000`
