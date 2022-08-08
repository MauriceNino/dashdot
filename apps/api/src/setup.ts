import { exec as exaca } from 'child_process';
import * as fs from 'fs';
import { promisify } from 'util';
import { CONFIG } from './config';

const exec = promisify(exaca);

const NET_PATH = CONFIG.running_in_docker
  ? '/mnt/host/sys/class/net/'
  : '/sys/class/net/';
const NET_PATH_INTERNAL = '/internal_mnt/host_sys/class/net/';

const NS_NET = '/mnt/host/proc/1/ns/net';
export let NET_INTERFACE_PATH = undefined;

const getDefaultIface = async (): Promise<string | undefined> => {
  if (CONFIG.use_network_interface !== '') {
    return CONFIG.use_network_interface;
  }

  try {
    let ifaceStr: string;
    if (CONFIG.running_in_docker) {
      const { stdout } = await exec(
        `nsenter --net=${NS_NET} route | grep default | awk '{print $8}'`
      );
      ifaceStr = stdout;
    } else {
      const { stdout } = await exec(`route | grep default | awk '{print $8}'`);
      ifaceStr = stdout;
    }

    const ifaces = ifaceStr.split('\n').filter(i => i !== '');
    const iface = ifaces[0].trim();

    if (ifaces.length > 1) {
      console.warn(
        `Multiple default network interfaces found [${ifaces.join(
          ', '
        )}], using "${iface}"`
      );
    }
    return iface;
  } catch (e) {
    console.error('Could not get default iface path');
    return undefined;
  }
};

const setupIfacePath = async (defaultIface: string) => {
  if (fs.existsSync(`${NET_PATH}${defaultIface}`)) {
    NET_INTERFACE_PATH = `${NET_PATH}${defaultIface}`;
    console.log(`Using default network interface "${defaultIface}"`);
  } else if (CONFIG.running_in_docker) {
    const mountpoint = `${NET_PATH_INTERNAL}${defaultIface}`;
    await exec(`mkdir -p /internal_mnt/host_sys/`);
    await exec(
      `mountpoint -q /internal_mnt/host_sys || nsenter --net=${NS_NET} mount -t sysfs nodevice /internal_mnt/host_sys`
    );

    if (fs.existsSync(mountpoint)) {
      NET_INTERFACE_PATH = mountpoint;
      console.log(
        `Using internally mounted network interface "${defaultIface}"`
      );
    } else {
      console.warn(
        `Network interface "${defaultIface}" not successfully mounted`
      );
    }
  } else {
    console.warn(`No path for iface "${defaultIface}" found`);
  }
};

export const setupNetworking = async () => {
  const iface = await getDefaultIface();
  if (iface) {
    await setupIfacePath(iface);
  }

  if (!NET_INTERFACE_PATH) {
    console.log('Using default network interface with no modifications');
  }
};

const LOCAL_OS_PATH = '/etc/os-release';
const MNT_OS_PATH = '/mnt/host/etc/os-release';

export const setupOsVersion = async () => {
  try {
    if (CONFIG.running_in_docker && fs.existsSync(MNT_OS_PATH)) {
      await exec(`ln -sf ${MNT_OS_PATH} ${LOCAL_OS_PATH}`);

      console.log(`Using host os version from "${MNT_OS_PATH}"`);
    } else {
      console.log(`Using host os version from "${LOCAL_OS_PATH}"`);
    }
  } catch (e) {
    console.warn(e);
  }
};
