import { StorageInfo, StorageLoad } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../../config';
import { getStaticServerInfo } from '../../static-info';
import { fromHost, platformIsWindows } from '../../utils';

type Block = si.Systeminformation.BlockDevicesData;
type Size = si.Systeminformation.FsSizeData;

const unwrapUsed = (size?: Size) => size?.used ?? 0;

export class DynamicStorageMapper {
  private validSizes: Size[];
  private validBlocks: Block[];
  private hasExplicitHost = false;

  constructor(
    private hostWin32: boolean,
    private layout: StorageInfo,
    private blocks: Block[],
    private sizes: Size[]
  ) {
    this.validSizes = this.getValidSizes();
    this.validBlocks = this.getValidBlocks();
    this.hasExplicitHost = this.getHasExplicitHost();
  }

  // Setup local values
  private getValidSizes() {
    return this.sizes.filter(
      ({ mount, type }) =>
        (this.hostWin32 || mount.startsWith(fromHost('/'))) &&
        !CONFIG.fs_type_filter.includes(type)
    );
  }

  private getValidBlocks() {
    return this.blocks.filter(({ type }) => type === 'part' || type === 'disk');
  }

  private getIsExplicitHost(deviceBlocks: Block[]) {
    return deviceBlocks.some(({ mount }) => this.isRootMount(mount));
  }

  private getHasExplicitHost() {
    return this.layout.some(({ disks, raidName }) =>
      this.getIsExplicitHost(
        this.getBlocksForDisks(disks).concat(this.getBlocksForRaid(raidName))
      )
    );
  }

  // Helpers
  private getBlocksForDisks(disks: StorageInfo[number]['disks']) {
    return this.blocks.filter(({ name, device }) =>
      disks.some(d =>
        this.hostWin32 ? d.device === device : name.startsWith(d.device)
      )
    );
  }
  private getBlocksForRaid(raidName: string) {
    return this.blocks.filter(({ name }) => name.startsWith(raidName));
  }

  private isRootMount(mount: string) {
    return (
      !this.hostWin32 &&
      (mount === fromHost('/') || mount.startsWith(fromHost('/boot')))
    );
  }

  private blocksHaveMounts(deviceBlocks: Block[]) {
    return deviceBlocks.some(
      ({ mount }) =>
        mount != null &&
        this.validSizes.some(s => s.mount === mount) &&
        (this.hostWin32 || mount.startsWith(fromHost('/')))
    );
  }

  // Get sizes of all unmapped sizes, including the host
  // because this function will only run, if there is no explicit host
  private getSizesOfAllUnmapped() {
    const hostMountUsed = unwrapUsed(
      this.validSizes.find(
        ({ mount, type }) => type !== 'squashfs' && this.isRootMount(mount)
      ) ?? this.sizes.find(({ mount }) => mount === '/')
    );
    const unclaimedSpace = this.validSizes
      .filter(
        ({ mount }) =>
          !this.isRootMount(mount) &&
          !this.validBlocks.some(part => part.mount === mount)
      )
      .reduce((acc, { used }) => acc + used, 0);

    return hostMountUsed + unclaimedSpace;
  }

  // Get the size of the explicit host
  private getHostSize(deviceBlocks: Block[]) {
    const hasNoExplicitMount = !deviceBlocks.some(
      d => d.mount === fromHost('/')
    );
    return hasNoExplicitMount
      ? unwrapUsed(
          this.validSizes.find(({ mount }) => mount === fromHost('/')) ??
            this.sizes.find(({ mount }) => mount === '/')
        )
      : 0;
  }

  // Get size of the mounts of the partitions/disks of device
  private getSizeForBlocks(deviceBlocks: Block[]) {
    return deviceBlocks.reduce(
      (acc, curr) =>
        acc +
        unwrapUsed(this.validSizes.find(({ mount }) => curr.mount === mount)),
      0
    );
  }

  public getMappedLayout() {
    let hostFound = false;

    return this.layout.map(({ disks, virtual, raidName }) => {
      if (virtual) {
        const size = this.sizes.find(s => s.fs === disks[0].device);
        return size?.used ?? 0;
      }

      const deviceBlocks = this.getBlocksForDisks(disks).concat(
        this.getBlocksForRaid(raidName)
      );
      const isExplicitHost = this.getIsExplicitHost(deviceBlocks);
      const hasMounts = this.blocksHaveMounts(deviceBlocks);

      if (isExplicitHost) {
        hostFound = true;
        return (
          this.getSizeForBlocks(deviceBlocks) + this.getHostSize(deviceBlocks)
        );
      }

      const assignAllUnmapped =
        !this.hasExplicitHost &&
        !hostFound &&
        (!hasMounts || this.layout.length === 1);

      if (assignAllUnmapped) {
        hostFound = true;
        return this.getSizesOfAllUnmapped();
      }

      return this.getSizeForBlocks(deviceBlocks);
    });
  }
}

export default async (): Promise<StorageLoad> => {
  const svInfo = getStaticServerInfo();
  const [blocks, sizes] = await Promise.all([si.blockDevices(), si.fsSize()]);

  return new DynamicStorageMapper(
    platformIsWindows(svInfo.os.platform),
    svInfo.storage,
    blocks,
    sizes
  ).getMappedLayout();
};
