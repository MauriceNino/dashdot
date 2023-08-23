---
sidebar_position: 2
tags:
  - Configuration
  - Styles
title: Processor
---

<!-- markdownlint-disable -->

# CPU Widget

<!-- markdownlint-enable -->

## `DASHDOT_CPU_WIDGET_GROW`

To adjust the relative size of the Processor widget.

- type: `number`
- default: `4`

## `DASHDOT_CPU_WIDGET_MIN_WIDTH`

To adjust the minimum width of the Processor widget (in px).

- type: `number`
- default: `500`

## `DASHDOT_CPU_SHOWN_DATAPOINTS`

The amount of datapoints in the Processor graph.

- type: `number`
- default: `20`

## `DASHDOT_CPU_POLL_INTERVAL`

Read the Processor load every x milliseconds.

- type: `number`
- default: `1000`

## `DASHDOT_CPU_CORES_TOGGLE_MODE`

Switches the Processor core view depending on the selected option. The `toggle` option allows you to switch the view from the dashboard, other options hide the toggle from the dashboard.

The available options are: `toggle`, `multi-core`, `average`. `average` shows a single graph with the average load across all cores. `multi-core` shows every core load graph individually.

- type: `string`
- default: `toggle`
