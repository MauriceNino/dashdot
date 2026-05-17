import { exec as cexec } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';
import { capFirst, type NetworkInfo, type NetworkLoad } from '@dashdot/common';
import dedent from 'dedent';
import * as si from 'systeminformation';
import { CONFIG } from '../config';
import { NET_INTERFACE_PATHS } from '../setup';
import { PLATFORM_IS_WINDOWS } from '../utils';

const exec = promisify(cexec);

const commandExists = async (command: string): Promise<boolean> => {
  try {
    const { stdout, stderr } = await exec(
      `${PLATFORM_IS_WINDOWS ? 'where' : 'which'} ${command}`,
    );
    return stderr === '' && stdout.trim() !== '';
  } catch (_e) {
    return false;
  }
};

type NetworkInterfaceCounter = {
  rx: number;
  tx: number;
};

export type NetworkInterfaceInfo = {
  name: string;
  type: string;
  interfaceSpeed?: number;
};

let [lastRx, lastTx, lastTs] = [0, 0, 0];

const getInterfaceName = (ifacePath: string): string =>
  ifacePath.split('/').filter(Boolean).at(-1) ?? ifacePath;

const readNetworkInterfaceCounters = async (
  ifacePath: string,
): Promise<NetworkInterfaceCounter> => {
  const [rx, tx] = await Promise.all([
    fs.promises.readFile(`${ifacePath}/statistics/rx_bytes`, 'utf-8'),
    fs.promises.readFile(`${ifacePath}/statistics/tx_bytes`, 'utf-8'),
  ]);

  const rxBytes = Number(rx.trim());
  const txBytes = Number(tx.trim());

  if (!Number.isFinite(rxBytes) || !Number.isFinite(txBytes)) {
    throw new Error('Could not get network stats');
  }

  return {
    rx: rxBytes,
    tx: txBytes,
  };
};

const readNetworkInterfacesDynamic = async (
  ifacePaths: string[],
): Promise<NetworkLoad> => {
  const interfaceCounters = await Promise.all(
    ifacePaths.map(readNetworkInterfaceCounters),
  );
  const rx = interfaceCounters.reduce((sum, iface) => sum + iface.rx, 0);
  const tx = interfaceCounters.reduce((sum, iface) => sum + iface.tx, 0);
  const thisTs = performance.now();
  const dividend = (thisTs - lastTs) / 1000;

  const result =
    lastTs === 0
      ? {
          up: 0,
          down: 0,
        }
      : {
          up: (tx - lastTx) / dividend,
          down: (rx - lastRx) / dividend,
        };

  lastRx = rx;
  lastTx = tx;
  lastTs = thisTs;

  return result;
};

const getNetworkInterfaceType = (ifacePath: string): string => {
  const isWireless = fs.existsSync(`${ifacePath}/wireless`);
  const isBridge = fs.existsSync(`${ifacePath}/bridge`);
  const isBond = fs.existsSync(`${ifacePath}/bonding`);
  const isTap = fs.existsSync(`${ifacePath}/tun_flags`);

  return isWireless
    ? 'Wireless'
    : isBridge
      ? 'Bridge'
      : isBond
        ? 'Bond'
        : isTap
          ? 'TAP'
          : 'Wired';
};

const readNetworkInterfaceSpeed = async (
  ifacePath: string,
): Promise<number | undefined> => {
  if (fs.existsSync(`${ifacePath}/wireless`)) {
    return undefined;
  }

  try {
    const speed = await fs.promises.readFile(`${ifacePath}/speed`, 'utf-8');
    const numValue = Number(speed.trim());

    return Number.isNaN(numValue) || numValue === -1 ? 0 : numValue;
  } catch (e) {
    console.warn(e);

    return 0;
  }
};

const readNetworkInterfaceInfo = async (
  ifacePath: string,
): Promise<NetworkInterfaceInfo> => ({
  name: getInterfaceName(ifacePath),
  type: getNetworkInterfaceType(ifacePath),
  interfaceSpeed: await readNetworkInterfaceSpeed(ifacePath),
});

export const mergeNetworkInterfaceInfo = (
  interfaces: NetworkInterfaceInfo[],
): Partial<NetworkInfo> => {
  const interfaceSpeeds = interfaces
    .map((iface) => iface.interfaceSpeed)
    .filter((speed): speed is number => speed != null);

  return {
    type: interfaces.map((iface) => `${iface.name} (${iface.type})`).join(', '),
    interfaceSpeed:
      interfaceSpeeds.length > 0
        ? interfaceSpeeds.reduce((sum, speed) => sum + speed, 0)
        : undefined,
  };
};

export default {
  dynamic: async (): Promise<NetworkLoad> => {
    if (NET_INTERFACE_PATHS.length > 0) {
      return readNetworkInterfacesDynamic(NET_INTERFACE_PATHS);
    } else {
      const networkStats = (await si.networkStats())[0];

      if (!networkStats) {
        throw new Error('Could not get network stats');
      }

      return {
        up: networkStats.tx_sec,
        down: networkStats.rx_sec,
      };
    }
  },
  static: async (): Promise<Partial<NetworkInfo>> => {
    if (NET_INTERFACE_PATHS.length > 0) {
      return mergeNetworkInterfaceInfo(
        await Promise.all(NET_INTERFACE_PATHS.map(readNetworkInterfaceInfo)),
      );
    } else {
      const networkInfo = await si.networkInterfaces();
      const defaultNet = networkInfo.find((net) => net.default);

      if (!defaultNet) {
        throw new Error('Could not get network info');
      }

      return {
        type: capFirst(defaultNet.type),
        interfaceSpeed: defaultNet.speed ?? undefined,
      };
    }
  },
  speedTest: async (printResult = false): Promise<Partial<NetworkInfo>> => {
    let usedRunner: string;
    let result: Partial<NetworkInfo>;
    const startMsSinceEpoch = Date.now().valueOf();

    if (CONFIG.speed_test_from_path) {
      usedRunner = 'file';
      const json = JSON.parse(
        fs.readFileSync(CONFIG.speed_test_from_path, 'utf-8'),
      );

      const unit = json.unit ?? 'bit';

      if (unit !== 'bit' && unit !== 'byte')
        throw new Error(
          "You can only use 'bit' or 'byte' as a unit for your speed-test results",
        );

      result = {
        speedDown: json.speedDown * (unit === 'bit' ? 1 : 8),
        speedUp: json.speedUp * (unit === 'bit' ? 1 : 8),
        publicIp: CONFIG.network_label_list.includes('public_ip')
          ? json.publicIp
          : undefined,
      };
    } else if (CONFIG.accept_ookla_eula && (await commandExists('speedtest'))) {
      usedRunner = 'ookla';
      const { stdout } = await exec(
        'speedtest --accept-license --accept-gdpr -f json',
      );
      const json = JSON.parse(stdout);

      result = {
        speedDown: json.download.bandwidth * 8,
        speedUp: json.upload.bandwidth * 8,
        publicIp: CONFIG.network_label_list.includes('public_ip')
          ? json.interface.externalIp
          : undefined,
      };
    } else if (await commandExists('speedtest-cli')) {
      usedRunner = 'speedtest-cli';
      const { stdout } = await exec('speedtest-cli --json --secure');
      const json = JSON.parse(stdout);

      result = {
        speedDown: json.download,
        speedUp: json.upload,
        publicIp: CONFIG.network_label_list.includes('public_ip')
          ? json.client.ip
          : undefined,
      };
    } else {
      throw new Error(dedent`
        There is no speedtest module installed - please use one of the following:
        - speedtest: https://www.speedtest.net/apps/cli
        - speedtest-cli: https://github.com/sivel/speedtest-cli

        Or alternatively, provide a local file with speedtest results,
        using DASHDOT_SPEEDTEST_FROM_PATH.
  
        For more help on how to setup dashdot, look here:
        https://getdashdot.com/docs/installation/from-source
      `);
    }

    if (printResult) {
      console.log(`Speed-test completed successfully [${usedRunner}]`, result);
    }

    result.lastSpeedTest = startMsSinceEpoch;

    return result;
  },
};
