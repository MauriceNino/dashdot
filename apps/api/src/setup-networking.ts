import { exec as exaca } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { CONFIG } from './config';

const exec = promisify(exaca);

export let NET_INTERFACE = 'unknown';

export const setupNetworking = async () => {
  if (fs.existsSync('/mnt/host_ns_net')) {
    try {
      await exec('mkdir -p /internal_mnt/host_sys');
      await exec(
        'mountpoint -q /internal_mnt/host_sys || nsenter --net=/mnt/host_ns_net mount -t sysfs nodevice /internal_mnt/host_sys'
      );
    } catch (e) {
      console.warn(e);
    }

    try {
      if (CONFIG.use_network_interface !== '') {
        if (
          fs.existsSync(
            `/internal_mnt/host_sys/class/net/${CONFIG.use_network_interface}`
          )
        ) {
          NET_INTERFACE = CONFIG.use_network_interface;
          console.log(`Using network interface from config "${NET_INTERFACE}"`);

          return;
        } else {
          console.warn(
            `Network interface "${CONFIG.use_network_interface}" not found, using first available interface`
          );
        }
      }

      const { stdout } = await exec(
        "nsenter --net=/mnt/host_ns_net route | grep default | awk '{print $8}'"
      );

      const iface = stdout.trim();

      if (iface !== '') {
        NET_INTERFACE = iface;

        console.log(`Using network interface "${NET_INTERFACE}"`);
      } else {
        console.warn(
          'Unable to determine network interface, using default container network interface'
        );
      }
    } catch (e) {
      console.warn(e);
    }
  } else {
    console.log(`Using default container network interface`);
  }
};
