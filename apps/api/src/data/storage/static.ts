import { StorageInfo } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../../config';

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

export default async (): Promise<StorageInfo> => {
  const [disks, blocks, sizes] = await Promise.all([
    si.diskLayout(),
    si.blockDevices(),
    si.fsSize(),
  ]);

  return {
    layout: mapToStorageLayout(disks, blocks, sizes),
  };
};
