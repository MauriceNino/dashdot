import { StorageInfo, StorageLoad } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../config';
import { getStaticServerInfo } from '../static-info';
import { fromHost } from '../utils';

export const mapToStorageOutput = (
  layout: StorageInfo['layout'],
  blocks: si.Systeminformation.BlockDevicesData[],
  sizes: si.Systeminformation.FsSizeData[]
) => {
  const validMounts = sizes.filter(
    ({ mount, type }) =>
      mount.startsWith(fromHost('/')) && !CONFIG.fs_type_filter.includes(type)
  );
  const hostMountUsed =
    (
      sizes.find(
        ({ mount, type }) => type !== 'squashfs' && mount === '/mnt/host'
      ) ?? sizes.find(({ mount }) => mount === '/')
    )?.used ?? 0;
  const validParts = blocks.filter(
    ({ type }) => type === 'part' || type === 'disk'
  );

  let hostFound = false;

  return {
    layout: layout
      .map(({ device, virtual }) => {
        if (virtual) {
          const size = sizes.find(s => s.fs === device);
          return size?.used ?? 0;
        }

        const deviceParts = validParts.filter(({ name }) =>
          name.startsWith(device)
        );
        const explicitHost =
          // drives where one of the partitions is mounted to the root or /mnt/host/boot/
          deviceParts.some(
            ({ mount }) =>
              mount === fromHost('/') || mount.startsWith(fromHost('/boot/'))
          );
        const potentialHost =
          // drives that have all partitions unmounted
          deviceParts.every(
            ({ mount }) => mount == null || !mount.startsWith(fromHost('/'))
          ) ||
          // if there is only one drive, it has to be the host
          layout.length === 1;

        if (explicitHost || !potentialHost) {
          const deviceSizes = deviceParts.reduce(
            (acc, curr) =>
              acc +
              (validMounts.find(({ mount }) => curr.mount === mount)?.used ??
                0),
            0
          );

          if (explicitHost) {
            hostFound = true;

            const hasNoExplicitMount = !deviceParts.some(
              d => d.mount === fromHost('/')
            );
            return (
              deviceSizes +
              (hasNoExplicitMount
                ? validMounts.find(({ mount }) => mount === fromHost('/'))
                    ?.used ?? 0
                : 0)
            );
          }

          return deviceSizes;
        }

        // Apply all unclaimed partitions to the host disk
        if (potentialHost && !hostFound) {
          hostFound = true;

          const unclaimedSpace = validMounts
            .filter(
              ({ mount }) => !validParts.some(part => part.mount === mount)
            )
            .reduce((acc, { used }) => acc + used, 0);

          return hostMountUsed + unclaimedSpace;
        }

        return 0;
      })
      .map(used => ({
        load: used,
      })),
  };
};

export const mapToStorageLayout = (
  disks: si.Systeminformation.DiskLayoutData[],
  blocks: si.Systeminformation.BlockDevicesData[],
  sizes: si.Systeminformation.FsSizeData[]
) => {
  const raidMembers = blocks.filter(block => block.fsType.endsWith('_member'));
  const blockDisks = blocks.filter(
    block =>
      block.type === 'disk' &&
      block.size > 0 &&
      !CONFIG.fs_device_filter.includes(block.name)
  );

  const blockLayout = blockDisks
    .map(disk => {
      const device = disk.name;
      const diskRaidMem = raidMembers.filter(member =>
        member.name.startsWith(device)
      );
      const nativeDisk = disks.find(
        d => disk.model != '' && d.name === disk.model
      ) ?? {
        vendor: disk.name,
        size: disk.size,
        type: disk.physical,
      };

      if (diskRaidMem.length > 0) {
        const isSplit = diskRaidMem[0].label.includes(':');

        let label: string;
        if (isSplit) {
          const splitLabel = diskRaidMem[0].label.split(':')[0];
          const hasUniqueName = !raidMembers.some(member => {
            const startSame = member.label.split(':')[0] === splitLabel;
            const isSame = member.label === diskRaidMem[0].label;

            return startSame && !isSame;
          });
          label = hasUniqueName ? splitLabel : diskRaidMem[0].label;
        } else {
          label = diskRaidMem[0].label;
        }

        return {
          device: device,
          brand: nativeDisk.vendor,
          size: nativeDisk.size,
          type: nativeDisk.type,
          raidGroup: label,
        };
      } else {
        return {
          device: device,
          brand: nativeDisk.vendor,
          size: nativeDisk.size,
          type: nativeDisk.type,
        };
      }
    })
    .filter(d => d != null);

  const sizesLayout = CONFIG.fs_virtual_mounts
    .map(mount => {
      const size = sizes.find(s => s.fs === mount);

      return size
        ? {
            device: size.fs,
            brand: size.fs,
            type: 'VIRTUAL',
            size: size.size,
            virtual: true,
          }
        : undefined;
    })
    .filter(d => d != null);

  return blockLayout.concat(sizesLayout);
};

export default {
  dynamic: async (): Promise<StorageLoad> => {
    const storageLayout = getStaticServerInfo().storage.layout;
    const [blocks, sizes] = await Promise.all([si.blockDevices(), si.fsSize()]);

    return mapToStorageOutput(storageLayout, blocks, sizes);
  },
  static: async (): Promise<StorageInfo> => {
    const [disks, blocks, sizes] = await Promise.all([
      si.diskLayout(),
      si.blockDevices(),
      si.fsSize(),
    ]);

    return {
      layout: mapToStorageLayout(disks, blocks, sizes),
    };
  },
};
