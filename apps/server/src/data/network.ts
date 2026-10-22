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

let [lastRx, lastTx, lastTs] = [0, 0, 0];

/**
 * Parse the raw stdout from concatenated `cat rx_bytes; cat tx_bytes;` calls
 * across one or more network interfaces, summing the total rx and tx bytes.
 *
 * For a single interface the output looks like:
 *   "12345\n67890\n"
 * For two interfaces:
 *   "12345\n67890\n11111\n22222\n"
 *
 * Values alternate: rx0, tx0, rx1, tx1, ...
 */
export const aggregateInterfaceStats = (
  stdout: string,
): {
  rx: number;
  tx: number;
} => {
  const values = stdout
    .split('\n')
    .filter((v) => v !== '')
    .map(Number);

  let rx = 0;
  let tx = 0;
  for (let i = 0; i < values.length; i += 2) {
    rx += values[i] || 0;
    tx += values[i + 1] || 0;
  }
  return { rx, tx };
};

export default {
  dynamic: async (): Promise<NetworkLoad> => {
    if (NET_INTERFACE_PATHS.length > 0) {
      // Read rx_bytes and tx_bytes from all monitored interfaces,
      // then sum them for combined throughput.
      const commands = NET_INTERFACE_PATHS.map(
        (p) =>
          `cat ${p}/statistics/rx_bytes;` + `cat ${p}/statistics/tx_bytes;`,
      ).join('');
      const { stdout } = await exec(commands);

      const { rx, tx } = aggregateInterfaceStats(stdout);

      const thisTs = performance.now();
      const dividend = (thisTs - lastTs) / 1000;

      if (!rx || !tx) {
        throw new Error('Could not get network stats');
      }

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
      // Use the primary (first) interface for type and speed detection
      const primaryPath = NET_INTERFACE_PATHS[0];
      const isWireless = fs.existsSync(`${primaryPath}/wireless`);
      const isBridge = fs.existsSync(`${primaryPath}/bridge`);
      const isBond = fs.existsSync(`${primaryPath}/bonding`);
      const isTap = fs.existsSync(`${primaryPath}/tun_flags`);

      const net: Partial<NetworkInfo> = {
        type: isWireless
          ? 'Wireless'
          : isBridge
            ? 'Bridge'
            : isBond
              ? 'Bond'
              : isTap
                ? 'TAP'
                : 'Wired',
      };

      // Wireless networks have no fixed Interface speed
      if (!isWireless) {
        try {
          const { stdout } = await exec(`cat ${primaryPath}/speed`);
          const numValue = Number(stdout.trim());

          net.interfaceSpeed =
            Number.isNaN(numValue) || numValue === -1 ? 0 : numValue;
        } catch (e) {
          console.warn(e);

          net.interfaceSpeed = 0;
        }
      }

      return net;
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
