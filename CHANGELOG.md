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
