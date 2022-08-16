<!-- markdownlint-disable -->
<h1>
  <img src=".github/images/banner_muted.png" alt="dash. - 一个现代化的服务器仪表盘">
</h1>

<p align="center">
  <a href="https://drone.mauz.io/MauriceNino/dashdot" target="_blank">
    <img title="Drone" src="https://drone.mauz.io/api/badges/MauriceNino/dashdot/status.svg">
  </a>

  <a href="https://discord.gg/3teHFBNQ9W" target="_blank">
    <img title="Discord" src="https://discord.com/api/guilds/986251291577688064/widget.png?style=shield">
  </a>
</p>
<p align="center">
  <i>如果您喜欢这个项目，欢迎加入我们的 <b>Discord</b> 并且给这个库<b>点 Star</b>！</i>
</p>

<br/>

<p align="center">
  <b>dash.</b>（又称<b>dashdot</b>）是一个现代化的服务器仪表板，采用最新技术以及玻璃拟物化设计。适用于私人服务器或更小型的 VPS.
</p>
<br />
<p align="center">
  <a href="https://dash.mauz.io" target="_blank">在线样板</a>
 |
  <a href="https://github.com/Sp1ke47/dashdot_zh-CN/pkgs/container/dashdot_zh-cn%2Fdashdot" target="_blank">Docker 镜像</a>
</p>

#

<a href="https://ko-fi.com/mauricenino" target="_blank">
  <img 
    align="right"
    width="160"
    style="padding-left: 20px; padding-bottom: 10px"
    alt="请考虑资助本项目的开发"
    src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
  />
</a>

<!-- markdownlint-enable -->

**dash.** 是一个开源项目，因此我们热烈欢迎一切贡献者。如果您有兴趣进一步开发此项目，请参阅
[Contributing.md](./.github/CONTRIBUTING.md).

如果您想在经济上支持这个项目，您可以访问原作者的
[GitHub Sponsors](https://github.com/sponsors/MauriceNino)，或者其 [Ko-Fi](https://ko-fi.com/mauricenino).

## 预览

<!-- markdownlint-disable -->

| 黑暗模式                                                                                    | 浅色模式                                                                                     |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <img src="apps/docs/static/img/screenshot_darkmode.png" alt="Screenshot of the dark-mode" /> | <img src="apps/docs/static/img/screenshot_lightmode.png" alt="Screenshot of the light-mode" /> |

<!-- markdownlint-enable -->

## 文档

- [安装选项](https://getdashdot.com/docs/install)
- [配置选项](https://getdashdot.com/docs/config)
- [贡献](./.github/CONTRIBUTING.md)
- [变更日志](./.github/CHANGELOG.md)

## 快速安装（Docker）

镜像资源托管在 [Github Packages](https://github.com/Sp1ke47/dashdot_zh-CN/pkgs/container/dashdot_zh-cn%2Fdashdot)，可用于 AMD64 和 ARM 设备。

```bash
docker container run -it \
  -p 80:3001 \
  -v /:/mnt/host:ro \
  --privileged \
  ghcr.io/sp1ke47/dashdot_zh-cn/dashdot:latest
```

## 源码安装

### 环境要求

- [node.js](https://nodejs.org/)（推荐 18.x 版本)
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)
- [speedtest](https://www.speedtest.net/apps/cli)（推荐）
- 或者改用：[speedtest-cli](https://github.com/sivel/speedtest-cli)

### 准备

下载并构建：

```
git clone https://github.com/Sp1ke47/dashdot_zh-CN &&\
  cd dashdot_zh-CN &&\
  yarn &&\
  yarn build:prod
```

完成后，使用以下命令启动仪表板：

```
sudo yarn start
```

### 配置

配置选项可以选择使用环境变量传递：

```
export DASHDOT_PORT="8080" &&\
  sudo yarn start
```


若要了解 flag 使用详情，或者采用其他安装方式（`docker-compose`），请参阅[安装选项](https://getdashdot.com/docs/install)。

若要阅读有关配置选项的更多信息，请参阅[配置选项](https://getdashdot.com/docs/config)。
