## [3.1.2](https://github.com/MauriceNino/dashdot/compare/v3.1.1...v3.1.2) (2022-06-09)


### Bug Fixes

* **api:** read temperature from main if no per-core data is found ([523e7a1](https://github.com/MauriceNino/dashdot/commit/523e7a1e768e55886832c6fe876dcd138d12e577)), closes [#107](https://github.com/MauriceNino/dashdot/issues/107)
* **view:** error on domains with multiple subdomains ([756774b](https://github.com/MauriceNino/dashdot/commit/756774b9ecf54b76bd074270e737c122447b7fb9))
* **view:** mobile browser address bar not hiding on scroll ([7a32a7c](https://github.com/MauriceNino/dashdot/commit/7a32a7cdaf478009d3c08b51231720e8660635f1))
* **view:** remove old CRA app name in manifest ([dd8e0a6](https://github.com/MauriceNino/dashdot/commit/dd8e0a617a1a4837d41103560b53b0b604206188))
* **view:** server image not shown on firefox ([adb6607](https://github.com/MauriceNino/dashdot/commit/adb660795ab51ddf739b5c0b931b138ab1555994))

## [3.1.1](https://github.com/MauriceNino/dashdot/compare/v3.1.0...v3.1.1) (2022-06-09)


### Bug Fixes

* **api:** invalid iface speed conversion for non-docker interface ([2a1425f](https://github.com/MauriceNino/dashdot/commit/2a1425f7fd402a006855b8cbb53cd9f8d1aedfe0)), closes [#105](https://github.com/MauriceNino/dashdot/issues/105)

# [3.1.0](https://github.com/MauriceNino/dashdot/compare/v3.0.0...v3.1.0) (2022-06-08)


### Bug Fixes

* **api:** exclude /etc from mounts ([bb0c2aa](https://github.com/MauriceNino/dashdot/commit/bb0c2aa44c3d933f158ef711ec0ed1f9d3448cd9))
* **api:** get sizes of all drives instead of just the main one ([356cacd](https://github.com/MauriceNino/dashdot/commit/356cacd47ac4f947c93e9a216dc5fbc05de8bbcb)), closes [#59](https://github.com/MauriceNino/dashdot/issues/59)
* **api:** read type and interface speed from host instead of container ([2f0eea4](https://github.com/MauriceNino/dashdot/commit/2f0eea45d4583464b5429e4f6c3d12b56cb5d645)), closes [#105](https://github.com/MauriceNino/dashdot/issues/105)
* **view:** extract label function to widget ([8718f5e](https://github.com/MauriceNino/dashdot/commit/8718f5e86d13ec9157f1b18baed77f1bdea5ce37))


### Features

* **view:** add percentage to storage widget ([e2cc3fa](https://github.com/MauriceNino/dashdot/commit/e2cc3fad305284e4ddd382958b6bb74fb0aedd0b)), closes [#104](https://github.com/MauriceNino/dashdot/issues/104)

# [3.0.0](https://github.com/MauriceNino/dashdot/compare/v2.3.0...v3.0.0) (2022-06-04)


### Bug Fixes

* **ci:** add correct drone hash ([c3ecf2c](https://github.com/MauriceNino/dashdot/commit/c3ecf2c18e12f880bfc6f8e2d6a2c4c77085a191))
* **view:** positioning of controls in firefox ([3794f0d](https://github.com/MauriceNino/dashdot/commit/3794f0de7d9c946e6cdd8961d2a03b8adf94fcd6)), closes [#93](https://github.com/MauriceNino/dashdot/issues/93)


### Documentation

* allow enable/disable item only through widget list ([b6c0c41](https://github.com/MauriceNino/dashdot/commit/b6c0c4162d1637f17c406e83ab3411624027f6ee)), closes [#64](https://github.com/MauriceNino/dashdot/issues/64)


### Features

* **api:** change volume mount for networking to a simpler one ([0a14c1f](https://github.com/MauriceNino/dashdot/commit/0a14c1f9e45696b8b4a39b012a0cfd4a6064a984)), closes [#58](https://github.com/MauriceNino/dashdot/issues/58)
* **view,api:** add configuration options for label order; add public ip option ([0994baa](https://github.com/MauriceNino/dashdot/commit/0994baad517b0e4851fba33b394e4188ede4f48a)), closes [#64](https://github.com/MauriceNino/dashdot/issues/64) [#57](https://github.com/MauriceNino/dashdot/issues/57)


### BREAKING CHANGES

* The old config options for disabling specific widgets are now obsolete
* **api:** volume mount for networking graph is different now

# [2.3.0](https://github.com/MauriceNino/dashdot/compare/v2.2.3...v2.3.0) (2022-06-02)


### Features

* **ci:** add automatic changelog generation ([69ff341](https://github.com/MauriceNino/dashdot/commit/69ff341271727d511772edfcfd25d3c248c1ff36))

# [2.2.1](https://github.com/MauriceNino/dashdot/compare/v2.0.0...v2.2.1) (2022-06-01)

##### Chores

* **deps:**
  *  switch back to node-modules linker (828f491f)
  *  upgrade multiple dependencies (416ea383)
  *  update dependencies (90196e68)
  *  disable dependabot PRs (61aa9f93)
  *  upgrade @types/react to v18.0.10 (2c769eb2)
  *  upgrade framer-motion to v6.3.6 (bcf8ea60)
  *  upgrade framer-motion to v6.3.5 (2c3bc297)
  *  disable dependabot PRs (5e2a3fc5)
  *  switch to pnp (ef5538b4)
  *  upgrade antd to v4.20.7 (76246592)
  *  upgrade systeminformation to v5.11.16 (36bad625)
  *  upgrade @testing-library/react to v13.3.0 (f99263d7)
  *  upgrade react-parallax-tilt to 1.7.37 (eda6c364)
  *  upgrade node:alpine to 18 (7f6d3631)
  *  upgrade typescript to 4.7.2 (7417e295)
* **ci:**
  *  add commit linting (7a2c3458)
  *  update renovate bot commit messages (2814a8af)
* **release:**
  *  v2.2.1 (f22a4fa7)
  *  v2.2.0 (cb119e39)
  *  v2.1.0 (cb410598)
  *  v2.0.1 (c3454683)
*  switch monorepo to nx (af1e91f2)

##### Documentation Changes

*  update screenshots (68c67bf6)

##### New Features

* **ci:**
  *  add semantic release (3fef1fb3)
* **frontend:**
  *  switch pie chart from nivo to recharts (8999801b)
  *  switch line charts from nivo to recharts (ecff6a29)
  *  add labels for current load (970b0d36)
  *  add multi-core view (02771d8f)

##### Bug Fixes

* **frontend:**
  *  byte/bit conversion in network graph (af8c839d)
  *  add back slash when data could not be loaded (2b16577e)
  *  shadows overlapping siblings (2e86c961)
* **docs:**  remove DASHDOT_ENABLE_TILT because it is not supported anymore (ae4b9490)
* **backend:**  logging in speedtest (861924f8)
* **ci:**  deployment for dev (1aa8f50e)
