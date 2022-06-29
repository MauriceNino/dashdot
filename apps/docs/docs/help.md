---
sidebar_position: 4
tags:
  - Help
---

# Help

## Q&A

<!-- markdownlint-disable MD033 -->
<details>
  <summary>How can I enable the GPU Widget?</summary>

You can use the [`DASHDOT_WIDGET_LIST`](./config#dashdot_widget_list) flag to add the GPU widget,
by passing a list that includes it (e.g. `os,cpu,storage,ram,network,gpu`). If you are running
on docker though, make sure to also carefully read the [GPU Widget Options](./config/widget-options/graphics).

</details>

<details>
  <summary>How can I make the percentage labels in the top left corner stay?</summary>

In earlier versions, the top-left percentage labels were on by default, but due to UX decisions, they are now
only enabled on mobile devices. If you want to bring back the old behavior, there is the flag
[`DASHDOT_ALWAYS_SHOW_PERCENTAGES`](./config#dashdot_always_show_percentages) for that.

</details>

<details>
  <summary>The network information can not be read correctly - what should I do?</summary>

First of all, if you are running docker, make sure that you are passing the `-v /proc/1/ns/net:/mnt/host_ns_net:ro`
bind mount. If you have done so, and it still does not work, please do the following:

> Check your logs for a message like `Using network interface "xxxxx"`.

**Is this the correct network interface?** If not, please find out your default interface, and pass the name
manually, using the [`DASHDOT_USE_NETWORK_INTERFACE`](./config#dashdot_use_network_interface) flag.

If it **is** the correct network interface, please open a GitHub issue with the relevant log outputs and information.

**Is there no message like this?** If so, please check your log for any errors and open a new issue on GitHub with
that information.

</details>

## Answer not found?

If you think there is no answer for your question and it is actually a bug, or a missing feature,
please create a [new Issue on GitHub](https://github.com/MauriceNino/dashdot/issues).

If you need further help, please [join our Discord](https://discord.gg/3teHFBNQ9W) - we are happy to answer any questions.

<br/>
<iframe
  src="https://discord.com/widget?id=986251291577688064&theme=dark"
  width="400"
  height="300"
  allowtransparency="true"
  frameborder="0"
  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
></iframe>
