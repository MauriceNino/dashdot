import { NetworkInfo, NetworkLoad, removePad } from '@dash/common';
import { exec as cexec } from 'child_process';
import * as fs from 'fs';
import * as si from 'systeminformation';
import { promisify } from 'util';
import { CONFIG } from '../config';
import { NET_INTERFACE_PATH } from '../setup';

const exec = promisify(cexec);

const commandExists = async (command: string): Promise<boolean> => {
  try {
    const { stdout, stderr } = await exec(`which ${command}`);
    return stderr === '' && stdout.trim() !== '';
  } catch (e) {
    return false;
  }
};

let [lastRx, lastTx, lastTs] = [0, 0, 0];

export default {
  dynamic: async (): Promise<NetworkLoad> => {
    if (NET_INTERFACE_PATH) {
      const { stdout } = await exec(
        `cat ${NET_INTERFACE_PATH}/statistics/rx_bytes;` +
          `cat ${NET_INTERFACE_PATH}/statistics/tx_bytes;`
      );
      const [rx, tx] = stdout.split('\n').map(Number);
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
    } else {
      const data = (await si.networkStats())[0];

      return {
        up: data.tx_sec,
        down: data.rx_sec,
      };
    }
  },
  static: async (): Promise<Partial<NetworkInfo>> => {
    if (NET_INTERFACE_PATH) {
      const isWireless = fs.existsSync(`${NET_INTERFACE_PATH}/wireless`);
      const isBridge = fs.existsSync(`${NET_INTERFACE_PATH}/bridge`);
      const isBond = fs.existsSync(`${NET_INTERFACE_PATH}/bonding`);
      const isTap = fs.existsSync(`${NET_INTERFACE_PATH}/tun_flags`);

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
        const { stdout } = await exec(`cat ${NET_INTERFACE_PATH}/speed`);
        const numValue = Number(stdout.trim());

        net.interfaceSpeed = isNaN(numValue) || numValue === -1 ? 0 : numValue;
      }
    } else {
      const networkInfo = await si.networkInterfaces();
      //@ts-ignore
      const defaultNet = networkInfo.find(net => net.default)!;

      return {
        type: defaultNet.type,
        interfaceSpeed: defaultNet.speed,
      };
    }
  },
  speedTest: async (printResult = false): Promise<Partial<NetworkInfo>> => {
    let usedRunner: string;
    let result: Partial<NetworkInfo>;
    if (CONFIG.accept_ookla_eula && (await commandExists('speedtest'))) {
      usedRunner = 'ookla';
      const { stdout } = await exec('speedtest -f json');
      const json = JSON.parse(stdout);

      result = {
        speedDown: json.download.bandwidth * 8,
        speedUp: json.upload.bandwidth * 8,
        publicIp: json.interface.externalIp,
      };
    } else if (await commandExists('speedtest-cli')) {
      usedRunner = 'speedtest-cli';
      const { stdout } = await exec('speedtest-cli --json --secure');
      const json = JSON.parse(stdout);

      result = {
        speedDown: json.download,
        speedUp: json.upload,
        publicIp: json.client.ip,
      };
    } else {
      throw new Error(removePad`
        There is no speedtest module installed - please use one of the following:
        - speedtest: https://www.speedtest.net/apps/cli
        - speedtest-cli: https://github.com/sivel/speedtest-cli
  
        For more help on how to setup dashdot, look here:
        https://getdashdot.com/docs/install/from-source
      `);
    }

    if (printResult) {
      console.log(`Speed-test completed successfully [${usedRunner}]`, result);
    }

    return result;
  },
};
