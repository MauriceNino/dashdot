import { exec } from 'child_process';
import { existsSync } from 'fs';
import * as si from 'systeminformation';
import { inspect, promisify } from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const execp = promisify(exec);
const execpnoerr = async (cmd: string): Promise<string> => {
  return execp(cmd)
    .then(({ stdout }) => stdout)
    .catch(() => '');
};

const inspectObj = (obj: any): string => {
  return inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
  });
};

yargs(hideBin(process.argv))
  .scriptName('yarn cli')
  .usage('yarn cli command [options...]')
  .command(
    'info',
    'show general information about your installation',
    yargs => yargs,
    async () => {
      const isDocker = existsSync('/.dockerenv');
      const isPodman = existsSync('/run/.containerenv');
      const yarnVersion = await execpnoerr('yarn --version');
      const nodeVersion = await execpnoerr('node --version');
      const buildInfoJson = await execpnoerr('cat version.json');
      const gitHash = await execpnoerr('git log -1 --format="%H"');

      const buildInfo = JSON.parse(buildInfoJson || '{}');
      const version = buildInfo.version ?? 'unknown';
      const buildhash = buildInfo.buildhash ?? gitHash;

      console.log(
        `
INFO
=========
Yarn: ${yarnVersion.trim()}
Node: ${nodeVersion.trim()}
Dash: ${version}

Cwd: ${process.cwd()}
Hash: ${buildhash}
In Docker: ${isDocker}
In Podman: ${isPodman}
      `.trim()
      );
    }
  )
  .command(
    'raw-data',
    'show the raw data that is collected in the backend for specific parts',
    yargs =>
      yargs
        .option('os', {
          boolean: true,
          describe: 'show raw os info',
        })
        .option('cpu', {
          boolean: true,
          describe: 'show raw cpu info',
        })
        .option('ram', {
          boolean: true,
          describe: 'show raw ram info',
        })
        .option('storage', {
          boolean: true,
          describe: 'show raw storage info',
        })
        .option('network', {
          boolean: true,
          describe: 'show raw network info',
        })
        .option('custom', {
          string: true,
          describe:
            'show custom raw info (provide systeminformation function name)',
        }),
    async args => {
      if (args.os) {
        console.log('OS:', inspectObj(await si.osInfo()));
      }
      if (args.cpu) {
        console.log('CPU:', inspectObj(await si.cpu()));
        console.log('CPU Load:', inspectObj(await si.currentLoad()));
        console.log('CPU Temp:', inspectObj(await si.cpuTemperature()));
      }
      if (args.ram) {
        console.log('Mem:', inspectObj(await si.mem()));
        console.log('Mem Layout:', inspectObj(await si.memLayout()));
      }
      if (args.storage) {
        console.log('Disk Layout:', inspectObj(await si.diskLayout()));
        console.log('FS Size', inspectObj(await si.fsSize()));
      }
      if (args.network) {
        console.log(
          'Network Interfaces:',
          inspectObj(await si.networkInterfaces())
        );
        console.log('Network Stats:', inspectObj(await si.networkStats()));
      }
      if (args.custom) {
        console.log(
          `Custom [${args.custom}]`,
          inspectObj(await si[args.custom]())
        );
      }
    }
  )
  .demandCommand(1, 1, 'You need to specify a single command')
  .strict()
  .parse();
