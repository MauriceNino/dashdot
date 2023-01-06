import { OsInfo } from '@dash/common';
import * as si from 'systeminformation';

export default {
  static: async (): Promise<OsInfo> => {
    const osInfo = await si.osInfo();

    return {
      arch: osInfo.arch,
      distro: osInfo.distro,
      kernel: osInfo.kernel,
      platform: osInfo.platform,
      release:
        osInfo.release === 'unknown'
          ? osInfo.build || 'unknown'
          : osInfo.release,
      uptime: 0,
    };
  },
};
