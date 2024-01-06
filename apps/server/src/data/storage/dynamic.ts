import { StorageInfo, StorageLoad } from '@dash/common';
import * as si from 'systeminformation';
import { CONFIG } from '../../config';
import { getStaticServerInfo } from '../../static-info';
import { PLATFORM_IS_WINDOWS, fromHost } from '../../utils';

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
    return this.getIsExplicitHost(this.validBlocks);
  }

  // Helpers
  private getBlocksForDisks(disks: StorageInfo[number]['disks']) {
    return this.blocks.filter(({ name, device }) =>
      disks.some(d =>
        this.hostWin32 ? d.device === device : name.startsWith(d.device)
      )
    );
  }
  private getBlocksForRaid(raidLabel: string, raidName: string) {
    return this.blocks.filter(
      ({ label, name }) =>
        label.startsWith(raidLabel) || name.startsWith(raidName)
    );
  }
  private getBlocksForXfs(parts: Block[]) {
    return this.blocks.filter(
      ({ uuid, type, fsType }) =>
        type === 'md' &&
        fsType === 'xfs' &&
        parts.some(part => part.uuid === uuid)
    );
  }

  private isRootMount(mount: string) {
    return (
      !this.hostWin32 &&
      (mount === fromHost('/') || mount.startsWith(fromHost('/boot')))
    );
  }

  // Get the size of the explicit host
  private getHostSize(deviceBlocks: Block[]) {
    const hasNoExplicitMount = !deviceBlocks.some(
      d => d.mount === fromHost('/')
    );
    return hasNoExplicitMount
      ? unwrapUsed(this.validSizes.find(({ mount }) => mount === fromHost('/')))
      : 0;
  }

  // Get size of the mounts of the partitions/disks of device
  private getSizeForBlocks(deviceBlocks: Block[]) {
    const sizes = this.validSizes.filter(size =>
      deviceBlocks.some(block => {
        const matchedByMount =
          size.mount &&
          (block.mount === size.mount ||
            size.mount.endsWith(`dev-disk-by-uuid-${block.uuid}`));
        const matchedByDevice =
          block.device && size.fs.startsWith(block.device);

        return matchedByMount || matchedByDevice;
      })
    );

    return sizes.reduce((acc, size) => acc + unwrapUsed(size), 0);
  }

  public getMappedLayout() {
    return this.layout.map(({ disks, virtual, raidLabel, raidName }) => {
      if (virtual) {
        const size = this.sizes.find(s => s.fs === disks[0].device);
        return size?.used ?? 0;
      }

      const deviceParts = this.getBlocksForDisks(disks);
      const deviceBlocks = deviceParts
        .concat(this.getBlocksForRaid(raidLabel, raidName))
        .concat(this.getBlocksForXfs(deviceParts));

      const isHost = deviceBlocks.some(({ mount }) => this.isRootMount(mount));

      if (isHost) {
        return (
          this.getSizeForBlocks(deviceBlocks) + this.getHostSize(deviceBlocks)
        );
      }

      return this.getSizeForBlocks(deviceBlocks);
    });
  }
}

export default async (): Promise<StorageLoad> => {
  const svInfo = getStaticServerInfo();
  const [sizes, blocks] = await Promise.all([si.fsSize(), si.blockDevices()]);

  return new DynamicStorageMapper(
    PLATFORM_IS_WINDOWS,
    svInfo.storage,
    blocks,
    sizes
  ).getMappedLayout();
};
