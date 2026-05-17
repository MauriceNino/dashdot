import { exec as exaca } from 'node:child_process';
import * as fs from 'node:fs';
import { promisify } from 'node:util';
import * as si from 'systeminformation';
import { CONFIG } from './config';
import {
  PLATFORM_IS_WINDOWS,
  refreshHostOsRelease,
  resolveSymlink,
} from './utils';

const exec = promisify(exaca);

const NET_PATH = CONFIG.running_in_docker
  ? '/mnt/host/sys/class/net/'
  : '/sys/class/net/';
const NET_PATH_INTERNAL = '/internal_mnt/host_sys/class/net/';

const NS_NET = '/mnt/host/proc/1/ns/net';
export let NET_INTERFACE_PATH: string | undefined;
export const NET_INTERFACE_PATHS: string[] = [];

export const parseNetworkInterfaces = (ifaceStr: string): string[] =>
  ifaceStr
    .split(/[\n,]/)
    .map((iface) => iface.trim())
    .filter((iface) => iface !== '');

const getDefaultIface = async (): Promise<string[]> => {
  if (CONFIG.use_network_interface != null) {
    return parseNetworkInterfaces(CONFIG.use_network_interface);
  }

  try {
    let ifaceStr: string;
    if (CONFIG.running_in_docker) {
      const { stdout } = await exec(
        `nsenter --net=${NS_NET} route | grep default | awk '{print $8}'`,
      );
      ifaceStr = stdout;
    } else {
      const { stdout } = await exec(`route | grep default | awk '{print $8}'`);
      ifaceStr = stdout;
    }

    const ifaces = parseNetworkInterfaces(ifaceStr);
    const iface = ifaces[0]?.trim();

    if (ifaces.length > 1) {
      console.warn(
        `Multiple default network interfaces found [${ifaces.join(
          ', ',
        )}], using "${iface}"`,
      );
    }
    return iface ? [iface] : [];
  } catch (_e) {
    console.error('Could not get default iface path');
    return [];
  }
};

const setupIfacePath = async (defaultIface: string) => {
  if (fs.existsSync(`${NET_PATH}${defaultIface}`)) {
    NET_INTERFACE_PATHS.push(`${NET_PATH}${defaultIface}`);
    console.log(`Using default network interface "${defaultIface}"`);
  } else if (CONFIG.running_in_docker) {
    const mountpoint = `${NET_PATH_INTERNAL}${defaultIface}`;
    await exec(`mkdir -p /internal_mnt/host_sys/`);
    await exec(
      `mountpoint -q /internal_mnt/host_sys || nsenter --net=${NS_NET} mount -t sysfs nodevice /internal_mnt/host_sys`,
    );

    if (fs.existsSync(mountpoint)) {
      NET_INTERFACE_PATHS.push(mountpoint);
      console.log(
        `Using internally mounted network interface "${defaultIface}"`,
      );
    } else {
      console.warn(
        `Network interface "${defaultIface}" not successfully mounted`,
      );
    }
  } else {
    console.warn(`No path for iface "${defaultIface}" found`);
  }
};

export const setupNetworking = async () => {
  NET_INTERFACE_PATHS.length = 0;
  NET_INTERFACE_PATH = undefined;

  const ifaces = await getDefaultIface();
  for (const iface of ifaces) {
    await setupIfacePath(iface);
  }

  NET_INTERFACE_PATH = NET_INTERFACE_PATHS[0];

  if (NET_INTERFACE_PATHS.length === 0) {
    console.log('Using default network interface with no modifications');
  }
};

const LOCAL_OS_PATHS = ['/etc/os-release', '/usr/lib/os-release'];
const MNT_OS_PATH_CANDIDATES = [
  '/mnt/host/etc/os-release',
  '/mnt/host/usr/lib/os-release',
];

export const setupOsVersion = async () => {
  try {
    if (CONFIG.running_in_docker) {
      const hostPath = MNT_OS_PATH_CANDIDATES.find((p) => fs.lstatSync(p));

      if (hostPath) {
        await refreshHostOsRelease();

        const realFile = await resolveSymlink(hostPath);
        const arrow = hostPath === realFile ? '' : ` → "${realFile}"`;

        console.log(
          `Bound "${hostPath}"${arrow} to ${LOCAL_OS_PATHS.filter((p) =>
            fs.existsSync(p),
          )
            .map((p) => `"${p}"`)
            .join(' and ')}`,
        );
        return;
      }
    }
  } catch (e) {
    console.warn(e);
  } finally {
    console.log(
      `Using os-release from ${LOCAL_OS_PATHS.filter((p) => fs.existsSync(p))
        .map((p) => `"${p}"`)
        .join(' or ')}`,
    );
  }
};

export const setupHostSpecific = async () => {
  if (PLATFORM_IS_WINDOWS) {
    console.log('Acquiring Windows Persistent Powershell');
    si.powerShellStart();
  }
};

export const tearDownHostSpecific = () => {
  if (PLATFORM_IS_WINDOWS) {
    console.log('Releasing Windows Persistent Powershell');
    si.powerShellRelease();
  }
};
