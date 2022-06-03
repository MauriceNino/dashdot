import { exec as exaca } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';

const exec = promisify(exaca);

export let NET_INTERFACE = 'unknown';

export const setupNetworking = async () => {
  if (fs.existsSync('/mnt/host_ns_net')) {
    try {
      await exec('mkdir -p /mnt/host_sys');
      await exec(
        'mountpoint -q /mnt/host_sys || nsenter --net=/mnt/host_ns_net mount -t sysfs nodevice /mnt/host_sys'
      );
    } catch (e) {
      console.warn(e);
    }

    try {
      const { stdout } = await exec(
        "nsenter --net=/mnt/host_ns_net route | grep default | awk '{print $8}'"
      );
      NET_INTERFACE = stdout.trim();

      console.log(`Using network interface "${NET_INTERFACE}"`);
    } catch (e) {
      console.warn(e);
    }
  } else {
    console.log(`Using default container network interface`);
  }
};
