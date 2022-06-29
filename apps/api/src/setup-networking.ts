import { exec as exaca } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { CONFIG } from './config';

const exec = promisify(exaca);

const NET_PATH = CONFIG.running_in_docker
  ? '/mnt/host/sys/class/net/'
  : '/sys/class/net/';
const NS_NET = '/mnt/host/proc/1/ns/net';
export let NET_INTERFACE_PATH = undefined;

export const setupNetworking = async () => {
  try {
    if (CONFIG.use_network_interface !== '') {
      const path = `${NET_PATH}${CONFIG.use_network_interface}`;
      if (fs.existsSync(path)) {
        NET_INTERFACE_PATH = path;
        console.log(
          `Using network interface from config "${CONFIG.use_network_interface}"`
        );

        return;
      } else {
        console.warn(
          `Network interface "${CONFIG.use_network_interface}" not found, using first available interface`
        );
      }
    }
  } catch (e) {
    console.warn(e);
  }

  if (CONFIG.running_in_docker && fs.existsSync(NS_NET)) {
    const { stdout } = await exec(
      `nsenter --net=${NS_NET} route | grep default | awk '{print $8}'`
    );

    const ifaces = stdout.split('\n');
    const iface = ifaces[0].trim();

    if (ifaces.length > 1) {
      console.warn(
        `Multiple default network interfaces found [${ifaces.join(
          ', '
        )}], using "${iface}"`
      );
    }

    if (iface !== '') {
      NET_INTERFACE_PATH = `${NET_PATH}${iface}`;

      console.log(`Using network interface "${iface}"`);
    } else {
      console.warn(
        'Unable to determine network interface, using default container network interface'
      );
    }
  } else {
    console.log(`Using default (container) network interface`);
  }
};
