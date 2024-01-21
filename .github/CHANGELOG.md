## [5.8.1](https://github.com/MauriceNino/dashdot/compare/v5.8.0...v5.8.1) (2024-01-21)

# [5.8.0](https://github.com/MauriceNino/dashdot/compare/v5.7.0...v5.8.0) (2024-01-21)


### Features

* add separate image for nvidia gpu support ([#1010](https://github.com/MauriceNino/dashdot/issues/1010)) ([319120d](https://github.com/MauriceNino/dashdot/commit/319120df3f636a7902e8ad1427264ec35db049fd)), closes [#290](https://github.com/MauriceNino/dashdot/issues/290)

# [5.7.0](https://github.com/MauriceNino/dashdot/compare/v5.6.1...v5.7.0) (2024-01-19)


### Features

* add option to run speedtest at cron interval ([d05c39c](https://github.com/MauriceNino/dashdot/commit/d05c39ce62f5e7261c2c0f7c5102ae01651c0f4f)), closes [#889](https://github.com/MauriceNino/dashdot/issues/889)

## [5.6.1](https://github.com/MauriceNino/dashdot/compare/v5.6.0...v5.6.1) (2024-01-19)


### Bug Fixes

* filter out ram sticks without a size ([0bf79fa](https://github.com/MauriceNino/dashdot/commit/0bf79fa28fe3889d6013af4c5a595015a29e9733))
* use max cpu frequency for static data instead of current ([a1da8ad](https://github.com/MauriceNino/dashdot/commit/a1da8ad60d65f12023ccfab844efee2016ab74f7))

# [5.6.0](https://github.com/MauriceNino/dashdot/compare/v5.5.2...v5.6.0) (2024-01-19)


### Bug Fixes

* change default version display to icon_hover ([fdc89a3](https://github.com/MauriceNino/dashdot/commit/fdc89a371c7dee449f08b737ca2547acafb83c31))


### Features

* add visual indication for disks with no valid mounts ([4f81ab6](https://github.com/MauriceNino/dashdot/commit/4f81ab60f105fbb9e21ab99f9c41a150e52bf50e)), closes [#1001](https://github.com/MauriceNino/dashdot/issues/1001)

## [5.5.2](https://github.com/MauriceNino/dashdot/compare/v5.5.1...v5.5.2) (2024-01-18)


### Bug Fixes

* filter sizes array for only rw ones ([e031e35](https://github.com/MauriceNino/dashdot/commit/e031e35950c8eb92c2f8a3d2789f8a6447ba66c1)), closes [#1008](https://github.com/MauriceNino/dashdot/issues/1008)

## [5.5.1](https://github.com/MauriceNino/dashdot/compare/v5.5.0...v5.5.1) (2024-01-09)


### Bug Fixes

* avoid adding pre-allocated space to lvm disks ([f1949b4](https://github.com/MauriceNino/dashdot/commit/f1949b474dca8a1b10883d45021ef9cbd0011cab))

# [5.5.0](https://github.com/MauriceNino/dashdot/compare/v5.4.0...v5.5.0) (2024-01-07)


### Features

* add option DASHDOT_CPU_TEMPS_MODE to switch between max and avg cpu temp readings ([2ec1e0f](https://github.com/MauriceNino/dashdot/commit/2ec1e0f46c942404f834a9da2e097c2f434e19a2)), closes [#932](https://github.com/MauriceNino/dashdot/issues/932)

# [5.4.0](https://github.com/MauriceNino/dashdot/compare/v5.3.2...v5.4.0) (2024-01-07)


### Bug Fixes

* add pre-allocated space of drive to current usage ([7f7050a](https://github.com/MauriceNino/dashdot/commit/7f7050a0b68b13e3526b8a2f8ac98a9090a1dd89)), closes [#882](https://github.com/MauriceNino/dashdot/issues/882)


### Features

* add custom scrollbar to main container ([9eacee2](https://github.com/MauriceNino/dashdot/commit/9eacee2da0e2b052538ec7b7c94da03e10e647cd)), closes [#922](https://github.com/MauriceNino/dashdot/issues/922)
* add option DASHDOT_NETWORK_SPEED_AS_BYTES to switch network speed to bytes per second ([56bd9d8](https://github.com/MauriceNino/dashdot/commit/56bd9d839a48637c23ad9c6ed19524a8f9f33a1e)), closes [#930](https://github.com/MauriceNino/dashdot/issues/930)
* add timestamp of last speedtest run on hover ([3c73ee4](https://github.com/MauriceNino/dashdot/commit/3c73ee4f93d9ceb3a5469d580fad4dce22dcda3f)), closes [#915](https://github.com/MauriceNino/dashdot/issues/915)

## [5.3.2](https://github.com/MauriceNino/dashdot/compare/v5.3.1...v5.3.2) (2024-01-06)


### Bug Fixes

* dynamic storage info slow on windows ([#993](https://github.com/MauriceNino/dashdot/issues/993)) ([64655f1](https://github.com/MauriceNino/dashdot/commit/64655f1bf0db52e0a10051f9a3523b594ef148fd))

## [5.3.1](https://github.com/MauriceNino/dashdot/compare/v5.3.0...v5.3.1) (2024-01-06)


### Bug Fixes

* filter out zram devices ([6d265d3](https://github.com/MauriceNino/dashdot/commit/6d265d3d58f217572da8967a2c6225e9278d7876)), closes [#981](https://github.com/MauriceNino/dashdot/issues/981)
* refactor storage load gathering; remove outdated tests ([390def6](https://github.com/MauriceNino/dashdot/commit/390def62a029ad63a097afe8c33f0f35a599f7cf)), closes [#883](https://github.com/MauriceNino/dashdot/issues/883)

# [5.3.0](https://github.com/MauriceNino/dashdot/compare/v5.2.3...v5.3.0) (2024-01-06)


### Bug Fixes

* add back and fix arm/v8 ([4284cf2](https://github.com/MauriceNino/dashdot/commit/4284cf204db8d3b51ee15e1b870d5be95fe20e72))
* bundling third party modules with cli package ([156ec72](https://github.com/MauriceNino/dashdot/commit/156ec72ab81780a2a913b0c36bedd763cbebefd5))
* lint not working for view ([5849edd](https://github.com/MauriceNino/dashdot/commit/5849edda33dc775ee0d49572322b8af1f5c70fd9))
* remove arm/v7 for now ([0ba25cd](https://github.com/MauriceNino/dashdot/commit/0ba25cd7fe99c79faebd3b462ec5afb32e9a2e31))
* remove arm/v8 for now ([6408997](https://github.com/MauriceNino/dashdot/commit/6408997bf74720615a3d45c68f093dcd8ca58456))
* testing errors ([f2937fd](https://github.com/MauriceNino/dashdot/commit/f2937fd15c4ba064fcaabad87308bb31c71ebbcd))


### Features

* [gpu] allow to filter-out some controller ([9651122](https://github.com/MauriceNino/dashdot/commit/96511226e70c9c050cbd6efb67341d6ff5062bde))
* **cpu widget:** allow user to switch (default) processor core view ([4def64e](https://github.com/MauriceNino/dashdot/commit/4def64ee0d340a2234ebf604b373dbb136b01abd))
* render network and gpu widgets individually instead of as pair ([#886](https://github.com/MauriceNino/dashdot/issues/886)) ([df59729](https://github.com/MauriceNino/dashdot/commit/df597292478c0ddcfa185702c190c111be34a9a0))


### Performance Improvements

* fix windows cpu 100% usage ([9c23e93](https://github.com/MauriceNino/dashdot/commit/9c23e937130cc81fd2100928bfa17614c525133a))

## [5.2.3](https://github.com/MauriceNino/dashdot/compare/v5.2.2...v5.2.3) (2023-08-23)

## [5.2.2](https://github.com/MauriceNino/dashdot/compare/v5.2.1...v5.2.2) (2023-08-23)


### Bug Fixes

* **api:** calculation for cpus with E/P cores not working ([3386923](https://github.com/MauriceNino/dashdot/commit/33869236ae7dd45795d2d8200901f511f65cd054)), closes [#706](https://github.com/MauriceNino/dashdot/issues/706)
* checksum for typescript ([6a14829](https://github.com/MauriceNino/dashdot/commit/6a1482931a2a0faa447a6f12f6777662588a403a))
* **speedtest:** not working on windows install ([#731](https://github.com/MauriceNino/dashdot/issues/731)) ([423837b](https://github.com/MauriceNino/dashdot/commit/423837b2f957fe5736818fec4a4c2c113df28214)), closes [#729](https://github.com/MauriceNino/dashdot/issues/729)


### Reverts

* upgrade prism-react-renderer to v2 ([6d60009](https://github.com/MauriceNino/dashdot/commit/6d60009d5cf1e350a323a723613845c29b80ac25))

## [5.2.1](https://github.com/MauriceNino/dashdot/compare/v5.2.0...v5.2.1) (2023-04-29)

# [5.2.0](https://github.com/MauriceNino/dashdot/compare/v5.1.3...v5.2.0) (2023-04-29)


### Bug Fixes

* also hide hidden storage labels on multiple drives ([213b73e](https://github.com/MauriceNino/dashdot/commit/213b73e5692ae7d1bdef564f0c7d8ba8e4613b41)), closes [#716](https://github.com/MauriceNino/dashdot/issues/716)
* dont crash on missing network interface speed ([c62ba63](https://github.com/MauriceNino/dashdot/commit/c62ba6395f7d34abccba579b8ed7111845023308)), closes [#715](https://github.com/MauriceNino/dashdot/issues/715) [#727](https://github.com/MauriceNino/dashdot/issues/727)
* hide public ip, if not included in label list ([ccf7d12](https://github.com/MauriceNino/dashdot/commit/ccf7d12051cb24ed4220eab5f2ef85cf6b54f8ce)), closes [#690](https://github.com/MauriceNino/dashdot/issues/690)
* **view:** remove not broadly supported ECMA Script features in the frontend ([5ba5ed2](https://github.com/MauriceNino/dashdot/commit/5ba5ed2ce501bac1b7ab2963c9bbd408c27177d7))


### Features

* allow adjusting of items per page in multi-drive storage widget ([54be449](https://github.com/MauriceNino/dashdot/commit/54be449be6351f157dfe9c72561854530da0252c))

## [5.1.3](https://github.com/MauriceNino/dashdot/compare/v5.1.2...v5.1.3) (2023-04-03)

## [5.1.2](https://github.com/MauriceNino/dashdot/compare/v5.1.1...v5.1.2) (2023-04-01)

## [5.1.1](https://github.com/MauriceNino/dashdot/compare/v5.1.0...v5.1.1) (2023-03-24)


### Bug Fixes

* allow drive mappings via uuid ([44e87a8](https://github.com/MauriceNino/dashdot/commit/44e87a8fd82311e8f1efd7c8f8294f29f1408c16))

# [5.1.0](https://github.com/MauriceNino/dashdot/compare/v5.0.0...v5.1.0) (2023-03-23)


### Features

* **view:** add options for showing dash version in UI ([57c4374](https://github.com/MauriceNino/dashdot/commit/57c4374b431088362585cb04c1d04f3dd3709668)), closes [#635](https://github.com/MauriceNino/dashdot/issues/635)

# [5.0.0](https://github.com/MauriceNino/dashdot/compare/v4.9.1...v5.0.0) (2023-03-08)


### Bug Fixes

* disallow unclaimed space assignment when host drive is filtered ([997cec6](https://github.com/MauriceNino/dashdot/commit/997cec6ed5fe9e6244a71a894ae76f4d58f053bd))


### Features

* add new config vars to replace old storage overrides ([3199dbd](https://github.com/MauriceNino/dashdot/commit/3199dbd5197db3c4b21094d4209812183bc14c33))
* add support for xfs based setups ([218d3e6](https://github.com/MauriceNino/dashdot/commit/218d3e6cbaddfa31854dbf3ceecf3ec7800b5579))
* support raid 0 in storage widget ([634aed5](https://github.com/MauriceNino/dashdot/commit/634aed5ef1c45899c26b69f8cb60b860c59e48ab)), closes [#295](https://github.com/MauriceNino/dashdot/issues/295)


### BREAKING CHANGES

* storage layout changed, so config options will no longer work the way they did
before

## [4.9.1](https://github.com/MauriceNino/dashdot/compare/v4.9.0...v4.9.1) (2023-02-22)


### Bug Fixes

* **api:** fix possible size mismatch on root mount ([148c1df](https://github.com/MauriceNino/dashdot/commit/148c1df772fc0b1b93edefb8f9d2fff8271519d6)), closes [#594](https://github.com/MauriceNino/dashdot/issues/594)

# [4.9.0](https://github.com/MauriceNino/dashdot/compare/v4.8.5...v4.9.0) (2023-02-08)


### Features

* **view:** add text size/offset parameters to widgets ([683d1e5](https://github.com/MauriceNino/dashdot/commit/683d1e5463bd9e19f1f53fa7687037cef347047c))

## [4.8.5](https://github.com/MauriceNino/dashdot/compare/v4.8.4...v4.8.5) (2023-02-07)

## [4.8.4](https://github.com/MauriceNino/dashdot/compare/v4.8.3...v4.8.4) (2023-02-05)

## [4.8.3](https://github.com/MauriceNino/dashdot/compare/v4.8.2...v4.8.3) (2023-02-01)


### Bug Fixes

* **api:** allow storage widget to work with win32 from host ([e5b9670](https://github.com/MauriceNino/dashdot/commit/e5b96709919653541fb9c9d28ae7793c825692fc))
* **api:** capitalize first letter in network type ([ad934e7](https://github.com/MauriceNino/dashdot/commit/ad934e70b4e802a2c11de874d4ac0332ced547a7))
* **api:** infer SSD type from interfaceType ([6d9ddb6](https://github.com/MauriceNino/dashdot/commit/6d9ddb6021c38e0396146b015c2ea63a7c4b9961))
* **api:** merge partitions in win32 ([8302df4](https://github.com/MauriceNino/dashdot/commit/8302df44a7650771d67ddd25fa116f4552f7c763))
* **view:** display 1000 Mb/s as 1 Gb/s ([a36aff0](https://github.com/MauriceNino/dashdot/commit/a36aff0b039b256bb9b4e1853ef2a1cc71f32da7))
* **view:** enable storage split-view by default ([7f5186e](https://github.com/MauriceNino/dashdot/commit/7f5186e8d21dfb6fb2c7f1108d1fb5291d89da7e))
* **view:** show unknown for disk vendor on multi-disk view ([93c7b1a](https://github.com/MauriceNino/dashdot/commit/93c7b1a8a2a1fabff6c449957990117a9fcec875))

## [4.8.2](https://github.com/MauriceNino/dashdot/compare/v4.8.1...v4.8.2) (2023-01-29)

## [4.8.1](https://github.com/MauriceNino/dashdot/compare/v4.8.0...v4.8.1) (2023-01-29)


### Bug Fixes

* **view:** allow chart labels to break line ([72443d2](https://github.com/MauriceNino/dashdot/commit/72443d20855f93cfe99bab8045cfb2bc9f41b2ae))

# [4.8.0](https://github.com/MauriceNino/dashdot/compare/v4.7.0...v4.8.0) (2023-01-29)


### Features

* add option to read speed-test result from file ([006dd6f](https://github.com/MauriceNino/dashdot/commit/006dd6f9b7e397dd350421b9ad1edae0ee881482)), closes [#558](https://github.com/MauriceNino/dashdot/issues/558)

# [4.7.0](https://github.com/MauriceNino/dashdot/compare/v4.6.1...v4.7.0) (2023-01-27)


### Bug Fixes

* add missing accessibility options ([f677f2f](https://github.com/MauriceNino/dashdot/commit/f677f2f0d55ac0ae388a443131d38db4fa2f2936))
* add source map for easier debugging in prod ([f4d141e](https://github.com/MauriceNino/dashdot/commit/f4d141ef3f7b9cab83a26565bac604aa2a301157))


### Features

* add server side compression and add font locally ([7cb2ffc](https://github.com/MauriceNino/dashdot/commit/7cb2ffcd13d793de8eafe3d50a52959411f00c40)), closes [#549](https://github.com/MauriceNino/dashdot/issues/549)
* set cache control headers ([ac12981](https://github.com/MauriceNino/dashdot/commit/ac12981fcbee33a7daa448df1e8f1349e0e8145f)), closes [#549](https://github.com/MauriceNino/dashdot/issues/549)

## [4.6.1](https://github.com/MauriceNino/dashdot/compare/v4.6.0...v4.6.1) (2023-01-06)


### Bug Fixes

* **api:** also filter disks by fs type filter ([0a97265](https://github.com/MauriceNino/dashdot/commit/0a97265796196d111c048e902c4457aa2a850b90))
* **api:** remove appendix from raid label when it is not a dupe ([23bbc05](https://github.com/MauriceNino/dashdot/commit/23bbc05625d7a1dd8536fc568d0353e63b4d2a2f)), closes [#514](https://github.com/MauriceNino/dashdot/issues/514)
* **api:** removed host size from unassigned sizes ([e462e28](https://github.com/MauriceNino/dashdot/commit/e462e286b41dafb2506d0a403a72cb455e1e6b18)), closes [#514](https://github.com/MauriceNino/dashdot/issues/514)
* **cli:** add instructions and formatting for cli output ([ae79e62](https://github.com/MauriceNino/dashdot/commit/ae79e62e8f00b6687acefe9fa21525edbb780871))
* **view:** cap storage graphs at 100% (visually) ([453a94b](https://github.com/MauriceNino/dashdot/commit/453a94b7cb93fba4f60f2ccc44464f0df5571245))

# [4.6.0](https://github.com/MauriceNino/dashdot/compare/v4.5.7...v4.6.0) (2022-12-31)


### Bug Fixes

* add mdadm to docker container for RAID info ([574aa41](https://github.com/MauriceNino/dashdot/commit/574aa418f2626f2f551e5b0dac55c45c8744bd5c))
* remove arm v7 from build ([04e1463](https://github.com/MauriceNino/dashdot/commit/04e146395200d43d2de6f20aeb907035387e1807))
* **view:** antd upgrade errors ([130e15b](https://github.com/MauriceNino/dashdot/commit/130e15b71c32c1587d7e1d217e206ff6342ab2ca))
* **view:** errors for transient props in styled-components ([599e968](https://github.com/MauriceNino/dashdot/commit/599e968c22b2efdbf40eaabc4f6b332a0b588724))


### Features

* **view:** add option for custom host ([01d35e0](https://github.com/MauriceNino/dashdot/commit/01d35e061a58d25658d240acc1556c97c6d12b58)), closes [#496](https://github.com/MauriceNino/dashdot/issues/496)

## [4.5.7](https://github.com/MauriceNino/dashdot/compare/v4.5.6...v4.5.7) (2022-11-17)

## [4.5.6](https://github.com/MauriceNino/dashdot/compare/v4.5.5...v4.5.6) (2022-11-13)

## [4.5.5](https://github.com/MauriceNino/dashdot/compare/v4.5.4...v4.5.5) (2022-11-13)


### Bug Fixes

* **api:** remove broken universal-speedtest to avoid confusion ([0f5e785](https://github.com/MauriceNino/dashdot/commit/0f5e7855e2be1187e1bed7de0630370f3fb31516))
* **view:** show virtual mounts as "disk" in widget ([0263a16](https://github.com/MauriceNino/dashdot/commit/0263a160ae10b97e7f1b2eb0e992d20e9424df99)), closes [#384](https://github.com/MauriceNino/dashdot/issues/384)

## [4.5.4](https://github.com/MauriceNino/dashdot/compare/v4.5.3...v4.5.4) (2022-11-13)


### Bug Fixes

* **speedtest-cli:** avoid speedtest DNS error ([bc0e9f5](https://github.com/MauriceNino/dashdot/commit/bc0e9f50979e7dfc09296d843c046324807a5eee))

## [4.5.3](https://github.com/MauriceNino/dashdot/compare/v4.5.2...v4.5.3) (2022-10-13)

## [4.5.2](https://github.com/MauriceNino/dashdot/compare/v4.5.1...v4.5.2) (2022-09-18)


### Bug Fixes

* **view:** storage multi-view sizing + text ([afb66c4](https://github.com/MauriceNino/dashdot/commit/afb66c4801e68076ad4562ba67636f05120f9e9a))

## [4.5.1](https://github.com/MauriceNino/dashdot/compare/v4.5.0...v4.5.1) (2022-09-18)


### Bug Fixes

* **view:** label not breaking correctly when green bar is too small ([1cd5e7b](https://github.com/MauriceNino/dashdot/commit/1cd5e7b65f1f6b57eddf4c41a5b89b30752cc498))
* **view:** show all storage options in widget mode ([6b969c3](https://github.com/MauriceNino/dashdot/commit/6b969c3ab4a21788de5f19b4038b5e995ebbb566)), closes [#385](https://github.com/MauriceNino/dashdot/issues/385)

# [4.5.0](https://github.com/MauriceNino/dashdot/compare/v4.4.0...v4.5.0) (2022-09-17)


### Bug Fixes

* **api:** bad group matching when raid labels have different endings ([db8d49f](https://github.com/MauriceNino/dashdot/commit/db8d49f1d790993f2ad49a9572fb2df9288f3183)), closes [#295](https://github.com/MauriceNino/dashdot/issues/295)
* **api:** error when host drive partition has no correct host mount ([1e49d4c](https://github.com/MauriceNino/dashdot/commit/1e49d4c4941b5c052abf77233c1e7f255c5eff58)), closes [#369](https://github.com/MauriceNino/dashdot/issues/369)
* **api:** storage widget not working on from source installation ([0ab0f66](https://github.com/MauriceNino/dashdot/commit/0ab0f663e30a88990cdec76511b5ee8d9d008f2e))
* **view:** drive not picking correct sizes in raid mode ([8bfc576](https://github.com/MauriceNino/dashdot/commit/8bfc57608d5b6c57aad4a58310427c53e4c597c7)), closes [#295](https://github.com/MauriceNino/dashdot/issues/295)


### Features

* **api:** add option to filter storage devices by name ([5eb6efb](https://github.com/MauriceNino/dashdot/commit/5eb6efb77fba59144722cb83e410523785fa290f)), closes [#314](https://github.com/MauriceNino/dashdot/issues/314)
* **view:** add percentage labels to storage split view ([718eb6b](https://github.com/MauriceNino/dashdot/commit/718eb6beafc0cfb9b41f2e5693d531df32c8729d)), closes [#370](https://github.com/MauriceNino/dashdot/issues/370)

# [4.4.0](https://github.com/MauriceNino/dashdot/compare/v4.3.10...v4.4.0) (2022-08-28)


### Bug Fixes

* **api:** storage widget showing 0 when host mount is explicit ([c413305](https://github.com/MauriceNino/dashdot/commit/c4133058509601c2981b491314de191b3f3d2f79))


### Features

* remove prettier steps ([7ee1bfb](https://github.com/MauriceNino/dashdot/commit/7ee1bfb5bb668c04f138dcf68d1d60adf6b58cae))

## [4.3.10](https://github.com/MauriceNino/dashdot/compare/v4.3.9...v4.3.10) (2022-08-16)


### Bug Fixes

* **api:** host drive did not collect all partition infos ([3caa68f](https://github.com/MauriceNino/dashdot/commit/3caa68f5ee9bfdf14dadcd5c5a0358aadadff90b)), closes [#277](https://github.com/MauriceNino/dashdot/issues/277)

## [4.3.9](https://github.com/MauriceNino/dashdot/compare/v4.3.8...v4.3.9) (2022-08-08)


### Bug Fixes

* **frontend:** fix web-manifest and sub-routing ([1c119d8](https://github.com/MauriceNino/dashdot/commit/1c119d8099aaebd79a80698f9be50d43c397bc19))

## [4.3.8](https://github.com/MauriceNino/dashdot/compare/v4.3.7...v4.3.8) (2022-08-08)


### Bug Fixes

* **api:** add nfs4 to ignored network drives ([b823aab](https://github.com/MauriceNino/dashdot/commit/b823aabcf9469b413f29ee7ea9db252db59f4a5e)), closes [#252](https://github.com/MauriceNino/dashdot/issues/252)
* **api:** change speedtest interval to every 4 hrs ([a04e1f9](https://github.com/MauriceNino/dashdot/commit/a04e1f9512bbf9807b98f5980b4c816e7727dbfd)), closes [#253](https://github.com/MauriceNino/dashdot/issues/253)

## [4.3.7](https://github.com/MauriceNino/dashdot/compare/v4.3.6...v4.3.7) (2022-08-01)

## [4.3.6](https://github.com/MauriceNino/dashdot/compare/v4.3.5...v4.3.6) (2022-07-20)

## [4.3.5](https://github.com/MauriceNino/dashdot/compare/v4.3.4...v4.3.5) (2022-07-19)


### Bug Fixes

* **api:** only include disks that are non-zero size ([5056532](https://github.com/MauriceNino/dashdot/commit/5056532f21f8608c02bea76322810dbbc98a059b)), closes [#218](https://github.com/MauriceNino/dashdot/issues/218)

## [4.3.4](https://github.com/MauriceNino/dashdot/compare/v4.3.3...v4.3.4) (2022-07-18)


### Bug Fixes

* **api:** assign mounts also by disk type ([0a2ddf3](https://github.com/MauriceNino/dashdot/commit/0a2ddf32c8947e08cb2df455794b23c7f0ba82b9)), closes [#214](https://github.com/MauriceNino/dashdot/issues/214)

## [4.3.3](https://github.com/MauriceNino/dashdot/compare/v4.3.2...v4.3.3) (2022-07-18)


### Bug Fixes

* **api:** assign host used, if only one drive exists ([38e62bc](https://github.com/MauriceNino/dashdot/commit/38e62bc677b812bba550fcce5a5de84dad028529)), closes [#214](https://github.com/MauriceNino/dashdot/issues/214)

## [4.3.2](https://github.com/MauriceNino/dashdot/compare/v4.3.1...v4.3.2) (2022-07-10)


### Bug Fixes

* **api:** fallback to disk block info when no native disk found ([ca180c0](https://github.com/MauriceNino/dashdot/commit/ca180c09161e3fc1e0cc154e2f379359528877d1)), closes [#196](https://github.com/MauriceNino/dashdot/issues/196)

## [4.3.1](https://github.com/MauriceNino/dashdot/compare/v4.3.0...v4.3.1) (2022-07-09)


### Bug Fixes

* **api:** dont fail on missing version file for integrations ([87449ff](https://github.com/MauriceNino/dashdot/commit/87449ffde7e1f62cfc2eb44e8c46dfa72c7d1805)), closes [#193](https://github.com/MauriceNino/dashdot/issues/193)

# [4.3.0](https://github.com/MauriceNino/dashdot/compare/v4.2.0...v4.3.0) (2022-07-08)


### Features

* **view:** add option to set page title ([e42fb84](https://github.com/MauriceNino/dashdot/commit/e42fb842ac795edbf69b34f6a0d61e214d5aed4e)), closes [#189](https://github.com/MauriceNino/dashdot/issues/189)

# [4.2.0](https://github.com/MauriceNino/dashdot/compare/v4.1.2...v4.2.0) (2022-07-07)


### Features

* **api,view:** add option to show specific virtual file mounts ([e5b2794](https://github.com/MauriceNino/dashdot/commit/e5b279425220a5b4966e664f90311370ad63a731))

## [4.1.2](https://github.com/MauriceNino/dashdot/compare/v4.1.1...v4.1.2) (2022-07-07)


### Bug Fixes

* **api:** give real host mount priority over docker host mount ([796c44b](https://github.com/MauriceNino/dashdot/commit/796c44ba8c242a4c918195b995aeedef837bb10d)), closes [#188](https://github.com/MauriceNino/dashdot/issues/188)
* remove invalid temp data from storage calculations ([45a2e74](https://github.com/MauriceNino/dashdot/commit/45a2e744c2cce22da1bddee627d6302c1f6c00ef))

## [4.1.1](https://github.com/MauriceNino/dashdot/compare/v4.1.0...v4.1.1) (2022-07-07)


### Bug Fixes

* **api:** networking for non-default docker installs ([cd2e63b](https://github.com/MauriceNino/dashdot/commit/cd2e63be1a0c1511c7488323fe609dc0645a2c70)), closes [#186](https://github.com/MauriceNino/dashdot/issues/186)

# [4.1.0](https://github.com/MauriceNino/dashdot/compare/v4.0.0...v4.1.0) (2022-07-06)


### Bug Fixes

* **api:** add invalid fs types ([a15cee8](https://github.com/MauriceNino/dashdot/commit/a15cee8c91296ae646aa8312416a9ae05c758ed9)), closes [#182](https://github.com/MauriceNino/dashdot/issues/182)
* automatically reload page when socket reconnects ([43f57d1](https://github.com/MauriceNino/dashdot/commit/43f57d1dead35423476a82d6413143cfa63dbbf1))


### Features

* add fs type filter to disable invalid storage types ([3ecd8b8](https://github.com/MauriceNino/dashdot/commit/3ecd8b8e3211d35d3e5013522c0ff279b5a59b40))

# [4.0.0](https://github.com/MauriceNino/dashdot/compare/v3.9.8...v4.0.0) (2022-07-05)


### Features

* **api,docker:** remove the need for multiple volume mounts ([ea8160e](https://github.com/MauriceNino/dashdot/commit/ea8160e55d71c4384ddfec663c1253c7e84889af))


### Reverts

* **deps:** upgrade inquirer to v9 ([9fd04af](https://github.com/MauriceNino/dashdot/commit/9fd04af4533b4363225bf78c5a4ae6414dc64122))


### BREAKING CHANGES

* **api,docker:** Previously, you needed to volume mount every disk seperately. Now you can simply do
it once with /:/mnt/host:ro.

## [3.9.8](https://github.com/MauriceNino/dashdot/compare/v3.9.7...v3.9.8) (2022-07-03)

## [3.9.7](https://github.com/MauriceNino/dashdot/compare/v3.9.6...v3.9.7) (2022-07-01)

## [3.9.6](https://github.com/MauriceNino/dashdot/compare/v3.9.5...v3.9.6) (2022-07-01)


### Bug Fixes

* **view:** storage chart overflow on multiview with >3 disks ([64d2b82](https://github.com/MauriceNino/dashdot/commit/64d2b8204eb6d3674a3de8eacc4568e494cc0f1a))

## [3.9.5](https://github.com/MauriceNino/dashdot/compare/v3.9.4...v3.9.5) (2022-06-30)


### Bug Fixes

* **view:** make storage label more floaty ([9619e27](https://github.com/MauriceNino/dashdot/commit/9619e2742bd4bab3b19cf285b560e91d4b1d6d76))

## [3.9.4](https://github.com/MauriceNino/dashdot/compare/v3.9.3...v3.9.4) (2022-06-29)

## [3.9.3](https://github.com/MauriceNino/dashdot/compare/v3.9.2...v3.9.3) (2022-06-28)


### Bug Fixes

* make all charts default to one comma precision ([ac7c99e](https://github.com/MauriceNino/dashdot/commit/ac7c99ed4b562a28875a855b12c289790aed2170))
* remove always on labels from pie chart ([86360a9](https://github.com/MauriceNino/dashdot/commit/86360a934bcb03ec97a24f0c4a4595b131d9ee81))

## [3.9.2](https://github.com/MauriceNino/dashdot/compare/v3.9.1...v3.9.2) (2022-06-28)

## [3.9.1](https://github.com/MauriceNino/dashdot/compare/v3.9.0...v3.9.1) (2022-06-27)


### Bug Fixes

* replace images with higher res ones ([bef477d](https://github.com/MauriceNino/dashdot/commit/bef477d03dba27d6949c4f5bbd04a98bc44ceb2d))
* **view:** make chart label position relative to container width ([6ad530d](https://github.com/MauriceNino/dashdot/commit/6ad530df5e2ea5d0d0f1c247be8f5d3a752df56e))

# [3.9.0](https://github.com/MauriceNino/dashdot/compare/v3.8.2...v3.9.0) (2022-06-27)


### Bug Fixes

* hide host in os widget by default ([3e7f9fd](https://github.com/MauriceNino/dashdot/commit/3e7f9fdcb27f4e3fbd13ee77f4b095c909189f72))


### Features

* add api endpoints to get current load ([48ab081](https://github.com/MauriceNino/dashdot/commit/48ab081e330ea2ebb21dcb61d26fbffca022e91d))
* show percentages only on mobile ([fc0d193](https://github.com/MauriceNino/dashdot/commit/fc0d1930d1056cce8bb0c7cdbbe68bb5fd307909)), closes [#149](https://github.com/MauriceNino/dashdot/issues/149)

## [3.8.2](https://github.com/MauriceNino/dashdot/compare/v3.8.1...v3.8.2) (2022-06-27)

## [3.8.1](https://github.com/MauriceNino/dashdot/compare/v3.8.0...v3.8.1) (2022-06-25)

# [3.8.0](https://github.com/MauriceNino/dashdot/compare/v3.7.2...v3.8.0) (2022-06-25)


### Features

* add integration options for other projects ([#137](https://github.com/MauriceNino/dashdot/issues/137)) ([422662d](https://github.com/MauriceNino/dashdot/commit/422662deeafc1a31be012a23b51816251f0a0d43))

## [3.7.2](https://github.com/MauriceNino/dashdot/compare/v3.7.1...v3.7.2) (2022-06-20)


### Bug Fixes

* assign unclaimed used space to the host drive ([a33aa1c](https://github.com/MauriceNino/dashdot/commit/a33aa1c0497c34a9c9713471b7072a5e4ef01b71))

## [3.7.1](https://github.com/MauriceNino/dashdot/compare/v3.7.0...v3.7.1) (2022-06-20)


### Bug Fixes

* non-empty mounts need to be mounted to /mnt/host_ ([f87657a](https://github.com/MauriceNino/dashdot/commit/f87657a41ee7f31e3f3f79b198591b174d20c52c))

# [3.7.0](https://github.com/MauriceNino/dashdot/compare/v3.6.0...v3.7.0) (2022-06-20)


### Features

* add optional storage split view ([962ecbe](https://github.com/MauriceNino/dashdot/commit/962ecbe2b9d88d466a3b57356215e377da70e107)), closes [#104](https://github.com/MauriceNino/dashdot/issues/104)

# [3.6.0](https://github.com/MauriceNino/dashdot/compare/v3.5.2...v3.6.0) (2022-06-19)


### Features

* add gpu widget ([0328463](https://github.com/MauriceNino/dashdot/commit/03284632e6960c51452aae10aba7a4cefd3b06a8)), closes [#43](https://github.com/MauriceNino/dashdot/issues/43)
* **api:** dont load unnecessary data for unused widgets ([c166974](https://github.com/MauriceNino/dashdot/commit/c16697473c70e119c7b7f08010266355493dfc84)), closes [#121](https://github.com/MauriceNino/dashdot/issues/121)
* load static info via websockets as well ([cad530d](https://github.com/MauriceNino/dashdot/commit/cad530d0c6f98af309a2f42ebab978ad425fc967)), closes [#122](https://github.com/MauriceNino/dashdot/issues/122)

## [3.5.2](https://github.com/MauriceNino/dashdot/compare/v3.5.1...v3.5.2) (2022-06-16)


### Bug Fixes

* **view:** change base 1024 size measurements to unambigous labels ([148f8db](https://github.com/MauriceNino/dashdot/commit/148f8dbb5decf81212cec6e938226f14dc79e565)), closes [#119](https://github.com/MauriceNino/dashdot/issues/119)
* **view:** single drive in raid mode not shown in one page ([ac01eb3](https://github.com/MauriceNino/dashdot/commit/ac01eb3ff592ba7e82e7b820e3cd8eab896e1dcb))

## [3.5.1](https://github.com/MauriceNino/dashdot/compare/v3.5.0...v3.5.1) (2022-06-15)


### Bug Fixes

* **view:** mobile view cutting off content ([3dd19bb](https://github.com/MauriceNino/dashdot/commit/3dd19bb33d662f02067b10ab100df94272ab9233))

# [3.5.0](https://github.com/MauriceNino/dashdot/compare/v3.4.0...v3.5.0) (2022-06-15)


### Bug Fixes

* **view:** add max-height to widgets ([8e9ccfb](https://github.com/MauriceNino/dashdot/commit/8e9ccfb644a5592e5e7b951cc056a2bce7187599))


### Features

* **view:** add pagination for servers with too many drives ([bb6fbfb](https://github.com/MauriceNino/dashdot/commit/bb6fbfb8f9262d61b4a4fecdf1a48856f5d55e79))

# [3.4.0](https://github.com/MauriceNino/dashdot/compare/v3.3.3...v3.4.0) (2022-06-15)


### Bug Fixes

* **api:** error on multiple default network interfaces ([3cf8774](https://github.com/MauriceNino/dashdot/commit/3cf877458cc938e0ae1a949935afee06b52f6184)), closes [#118](https://github.com/MauriceNino/dashdot/issues/118)


### Features

* **api, view:** add raid information to storage widget ([ba84d34](https://github.com/MauriceNino/dashdot/commit/ba84d34d2c403c7b1f8cfcb30de78593da58bf57)), closes [#40](https://github.com/MauriceNino/dashdot/issues/40)
* **api:** add option to select the used network interface ([8b6a78d](https://github.com/MauriceNino/dashdot/commit/8b6a78d6a9f18dfb4dbfdf73d797b94bb6b33b68)), closes [#117](https://github.com/MauriceNino/dashdot/issues/117)
* **view:** add option to show in imperial units ([d4b1f69](https://github.com/MauriceNino/dashdot/commit/d4b1f69a36e02c8e5b762cabb7b63225e9be3f10))

## [3.3.3](https://github.com/MauriceNino/dashdot/compare/v3.3.2...v3.3.3) (2022-06-13)


### Bug Fixes

* **deps:** upgrade systeminformation to v5.11.20 ([404ed9e](https://github.com/MauriceNino/dashdot/commit/404ed9ed9dea7cda9f9e0f4e6ef93554019f9d91)), closes [#111](https://github.com/MauriceNino/dashdot/issues/111) [#114](https://github.com/MauriceNino/dashdot/issues/114)

## [3.3.2](https://github.com/MauriceNino/dashdot/compare/v3.3.1...v3.3.2) (2022-06-13)


### Bug Fixes

* **view:** missing box-shadow on charts (firefox) ([02bf98b](https://github.com/MauriceNino/dashdot/commit/02bf98bf6ab52e409b86e4366654dd221b95ba01))

## [3.3.1](https://github.com/MauriceNino/dashdot/compare/v3.3.0...v3.3.1) (2022-06-13)


### Bug Fixes

* **deps:** revert - upgrade systeminformation to v5.11.17 ([41f2150](https://github.com/MauriceNino/dashdot/commit/41f2150e401344f66b74ba2f0cc4078c4fbf8632)), closes [#114](https://github.com/MauriceNino/dashdot/issues/114)

# [3.3.0](https://github.com/MauriceNino/dashdot/compare/v3.2.1...v3.3.0) (2022-06-13)


### Bug Fixes

* **api,docker:** fixed speedtest bugs ([dbfbc68](https://github.com/MauriceNino/dashdot/commit/dbfbc68fef77bf1296378e82db96722b46e77040))
* **api,docker:** fixed speedtest install ([2ae1be2](https://github.com/MauriceNino/dashdot/commit/2ae1be2ed0f968e3a5b01b9d88e0067bf5af24d8))
* **api,docker:** replaced speedtest-cli with speedtest ([3f1b5ac](https://github.com/MauriceNino/dashdot/commit/3f1b5ac7bc273455e38815beaae7442a6aca238f))
* **api:** fixed release for Arch Linux ([168c759](https://github.com/MauriceNino/dashdot/commit/168c759a8bf52862d583d84643c339e143f137b8))


### Features

* **api:** add log output for speedtest runner ([26267b2](https://github.com/MauriceNino/dashdot/commit/26267b2668d90648c815938e313a8577b5d3bba5))
* **cli:** add buildhash and version to info output ([c683ee4](https://github.com/MauriceNino/dashdot/commit/c683ee4c5969334b51b9abe9a100635cd7413023))
* **cli:** add cli to better handle issues ([0c7944f](https://github.com/MauriceNino/dashdot/commit/0c7944fc55ed6cfb87397da4243e20555f06acd8))

## [3.2.1](https://github.com/MauriceNino/dashdot/compare/v3.2.0...v3.2.1) (2022-06-12)


### Bug Fixes

* **api:** invalid brand & model ([51f593e](https://github.com/MauriceNino/dashdot/commit/51f593e6b3b5e2f4c20f7ee43159ee83ccb6808d))

# [3.2.0](https://github.com/MauriceNino/dashdot/compare/v3.1.3...v3.2.0) (2022-06-12)


### Bug Fixes

* **api:** calculate network speed in relation to time diff ([55ec6b2](https://github.com/MauriceNino/dashdot/commit/55ec6b22d0668a5f31ea3a959586d35423a2ed5c))
* **api:** match any mounts that are present at /mnt/host_* ([810e5a6](https://github.com/MauriceNino/dashdot/commit/810e5a6dac7e71ee28fd388bb0570d0378bba7ea)), closes [#108](https://github.com/MauriceNino/dashdot/issues/108)


### Features

* **view:** show error widget when static data cant be loaded ([89d9fcc](https://github.com/MauriceNino/dashdot/commit/89d9fcc3ab976fc39e40f53a271984453298c0bd))

## [3.1.3](https://github.com/MauriceNino/dashdot/compare/v3.1.2...v3.1.3) (2022-06-09)


### Bug Fixes

* reduced docker image size ([d29ed54](https://github.com/MauriceNino/dashdot/commit/d29ed546aa9b4273191c671282a5c1d9873e9d34))

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
