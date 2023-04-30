import { RaidType, StorageInfo } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../../config';
import { getStaticServerInfo } from '../../static-info';
import { platformIsWindows } from '../../utils';

type Block = si.Systeminformation.BlockDevicesData;
type Disk = si.Systeminformation.DiskLayoutData;
type Size = si.Systeminformation.FsSizeData;

const getDiskBlocks = (blocks: Block[]) =>
  blocks.filter(
    block =>
      block.type === 'disk' &&
      block.size > 0 &&
      !CONFIG.fs_device_filter.includes(block.name) &&
      !CONFIG.fs_type_filter.includes(block.fsType)
  );

const getDiskParts = (blocks: Block[], diskBlock: Block, hostWin32: boolean) =>
  blocks.filter(
    ({ name, device, type }) =>
      type === 'part' &&
      (hostWin32
        ? diskBlock.device === device
        : name.startsWith(diskBlock.name))
  );

const getNativeDisk = (
  disks: Disk[],
  block: Block
): {
  vendor: string;
  size: number;
  type: string;
  interfaceType?: string;
} =>
  disks.find(
    d =>
      d.device === block.device || (block.model != '' && d.name === block.model)
  ) ?? {
    vendor: block.name,
    size: block.size,
    type: block.physical,
  };

const getVirtualMountsLayout = (sizes: Size[]) =>
  CONFIG.fs_virtual_mounts
    .map(mount => {
      const size = sizes.find(s => s.fs === mount);

      return size
        ? {
            size: size.size,
            virtual: true,
            disks: [
              {
                device: size.fs,
                brand: size.fs,
                type: 'VIRTUAL',
              },
            ],
          }
        : undefined;
    })
    .filter(d => d != null);

const getRaidInfo = (blocks: Block[], diskBlock: Block, hostWin32: boolean) => {
  const allRaidBlocks = blocks.filter(block => block.type.startsWith('raid'));
  const partBlocks = [diskBlock, ...getDiskParts(blocks, diskBlock, hostWin32)];
  const raidBlocks = allRaidBlocks.reduce(
    (acc, curr) => {
      if (partBlocks.some(({ group }) => curr.name === group)) {
        acc.current.push(curr);
      } else {
        acc.other.push(curr);
      }
      return acc;
    },
    { current: [] as Block[], other: [] as Block[] }
  );

  if (raidBlocks.current.length === 0) return;

  const firstRaidBlock = raidBlocks.current[0];
  const splitLabel = firstRaidBlock.label.split(':')[0];
  const label = firstRaidBlock.label.includes(':')
    ? raidBlocks.other.some(({ label }) => label.startsWith(`${splitLabel}:`))
      ? firstRaidBlock.label
      : splitLabel
    : firstRaidBlock.label;

  return {
    label,
    type: raidBlocks.current[0].type === 'raid0' ? RaidType.ZERO : RaidType.ONE,
    name: raidBlocks.current[0].name,
    size: raidBlocks.current.reduce((acc, curr) => acc + curr.size, 0),
  };
};

const getDiskType = (type: string, interfaceType?: string) => {
  return type === 'SSD' && interfaceType === 'NVMe' ? 'NVMe' : type;
};

export const mapToStorageLayout = (
  hostWin32: boolean,
  disks: Disk[],
  blocks: Block[],
  sizes: Size[]
): StorageInfo => {
  const diskBlocks = getDiskBlocks(blocks);

  const mapDiskBlock = (acc: StorageInfo, diskBlock: Block) => {
    const device = diskBlock.name;
    const nativeDisk = getNativeDisk(disks, diskBlock);
    const raidInfo = getRaidInfo(blocks, diskBlock, hostWin32);

    const disk: StorageInfo[number]['disks'][number] = {
      device: hostWin32 ? diskBlock.device : device,
      brand: nativeDisk.vendor,
      type: getDiskType(nativeDisk.type, nativeDisk.interfaceType),
    };

    if (raidInfo != null) {
      const existingRaid = acc.find(r => r.raidName === raidInfo.name);
      if (existingRaid) {
        existingRaid.disks.push(disk);
      } else {
        acc.push({
          raidLabel: raidInfo.label,
          raidName: raidInfo.name,
          raidType: raidInfo.type,
          size: raidInfo.size,
          disks: [disk],
        });
      }
    } else {
      acc.push({
        size: nativeDisk.size,
        disks: [disk],
      });
    }

    return acc;
  };

  const blockLayout = (
    hostWin32
      ? diskBlocks.reduce((acc, curr) => {
          if (curr.device && !acc.some(b => b.device === curr.device)) {
            acc.push(curr);
          }
          return acc;
        }, [] as Block[])
      : diskBlocks
  ).reduce(mapDiskBlock, [] as StorageInfo);

  const sizesLayout = getVirtualMountsLayout(sizes);

  return blockLayout.concat(sizesLayout);
};

export default async (): Promise<StorageInfo> => {
  const svInfo = getStaticServerInfo();
  const [disks, blocks, sizes] = await Promise.all([
    si.diskLayout(),
    si.blockDevices(),
    si.fsSize(),
  ]);

  return mapToStorageLayout(
    platformIsWindows(svInfo.os.platform),
    disks,
    blocks,
    sizes
  );
};
