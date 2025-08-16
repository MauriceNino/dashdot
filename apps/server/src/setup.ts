import { exec as exaca } from 'child_process';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { promisify } from 'util';
import { CONFIG } from './config';
import { PLATFORM_IS_WINDOWS, refreshHostOsRelease, resolveSymlink } from './utils';

const exec = promisify(exaca);

const NET_PATH = CONFIG.running_in_docker
  ? '/mnt/host/sys/class/net/'
  : '/sys/class/net/';
const NET_PATH_INTERNAL = '/internal_mnt/host_sys/class/net/';

const NS_NET = '/mnt/host/proc/1/ns/net';
export let NET_INTERFACE_PATH = undefined;

const getDefaultIface = async (): Promise<string | undefined> => {
  if (CONFIG.use_network_interface != null) {
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

export const setupOsVersion = async () => {
  // Establish initial links (no-op when not in Docker)
  await refreshHostOsRelease();

  const OS_CANDIDATES = [
    '/etc/lsb-release',
    '/etc/os-release',
    '/usr/lib/os-release',
    '/etc/openwrt_release',
  ];

  const reports: string[] = [];

  for (const p of OS_CANDIDATES) {
    let stat: fs.Stats | undefined;
    try {
      stat = fs.lstatSync(p);
    } catch (e) {
      const code = (e as NodeJS.ErrnoException)?.code;
      if (code === 'ENOENT' || code === 'ENOTDIR') {
        reports.push(`${p} [missing]`);
        continue;
      }
      // Other errors (e.g. permission) – try to resolve anyway as best effort
    }

    if (stat?.isSymbolicLink()) {
      try {
        const target = await resolveSymlink(p);
        const arrow = p === target ? '' : ` -> "${target}"`;
        reports.push(`${p}${arrow}`);
      } catch (err) {
        reports.push(`${p} -> [unresolved: ${(err as Error).message}]`);
      }
    } else if (stat) {
      reports.push(`${p} (file)`);
    } else {
      try {
        const target = await resolveSymlink(p);
        const arrow = p === target ? '' : ` -> "${target}"`;
        reports.push(`${p}${arrow}`);
      } catch (err) {
        reports.push(`${p} [unresolved: ${(err as Error).message}]`);
      }
    }
  }

  if (reports.length) {
    console.log('OS metadata files:');
    for (const line of reports) console.log(`  ${line}`);
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
