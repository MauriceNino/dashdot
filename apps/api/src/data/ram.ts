import { RamInfo, RamLoad } from '@dash/common';
import * as si from 'systeminformation';

export default {
  dynamic: async (): Promise<RamLoad> => {
    return (await si.mem()).active;
  },
  static: async (): Promise<RamInfo> => {
    const [info, layout] = await Promise.all([si.mem(), si.memLayout()]);

    return {
      size: info.total,
      layout: layout.map(({ manufacturer, type, clockSpeed }) => ({
        brand: manufacturer,
        type: type,
        frequency: clockSpeed ?? undefined,
      })),
    };
  },
};
