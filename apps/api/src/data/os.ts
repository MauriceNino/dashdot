import { OsInfo } from '@dash/common';
import * as si from 'systeminformation';

export default {
  static: async (): Promise<OsInfo> => {
    const info = await si.osInfo();

    return {
      arch: info.arch,
      distro: info.distro,
      kernel: info.kernel,
      platform: info.platform,
      release:
        info.release === 'unknown' ? info.build || 'unknown' : info.release,
      uptime: 0,
    };
  },
};
