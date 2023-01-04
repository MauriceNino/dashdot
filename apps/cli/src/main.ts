import { removePad } from '@dash/common';
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

      const runningInDocker = await execpnoerr(
        'echo $DASHDOT_RUNNING_IN_DOCKER'
      );
      const buildInfo = JSON.parse(buildInfoJson || '{}');
      const version = buildInfo.version ?? 'unknown';
      const buildhash = buildInfo.buildhash ?? gitHash;

      console.log(
        removePad`
          INFO
          =========
          Yarn: ${yarnVersion.trim()}
          Node: ${nodeVersion.trim()}
          Dash: ${version}

          Cwd: ${process.cwd()}
          Hash: ${buildhash}
          In Docker: ${isDocker}
          In Podman: ${isPodman}
          In Docker (env): ${runningInDocker}`
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
        .option('gpu', {
          boolean: true,
          describe: 'show raw gpu info',
        })
        .option('custom', {
          string: true,
          describe:
            'show custom raw info (provide systeminformation function name)',
        }),
    async args => {
      console.log(
        removePad`
          If you were asked to paste the output of this command, please post only the following:

          - On GitHub: Everything between the lines
          - On Discord: Everything between the \`\`\`

          ${'-'.repeat(40)}

          <details>
            <summary>Output:</summary>

          \`\`\`js
        `
      );

      if (args.os) {
        console.log('const osInfo = ', inspectObj(await si.osInfo()));
      }
      if (args.cpu) {
        console.log('const cpuInfo = ', inspectObj(await si.cpu()));
        console.log('const cpuLoad = ', inspectObj(await si.currentLoad()));
        console.log('const cpuTemp = ', inspectObj(await si.cpuTemperature()));
      }
      if (args.ram) {
        console.log('const memInfo = ', inspectObj(await si.mem()));
        console.log('const memLayout = ', inspectObj(await si.memLayout()));
      }
      if (args.storage) {
        console.log('const disks = ', inspectObj(await si.diskLayout()));
        console.log('const sizes = ', inspectObj(await si.fsSize()));
        console.log('const blocks = ', inspectObj(await si.blockDevices()));
      }
      if (args.network) {
        console.log(
          'const networkInfo = ',
          inspectObj(await si.networkInterfaces())
        );
        console.log(
          'const networkStats = ',
          inspectObj(await si.networkStats())
        );
      }
      if (args.gpu) {
        console.log('const gpuInfo = ', inspectObj(await si.graphics()));
      }
      if (args.custom) {
        console.log(
          `const custom_${args.custom}:`,
          inspectObj(await si[args.custom]())
        );
      }

      console.log(
        removePad`
          \`\`\`
          
          </details>
          
          ${'-'.repeat(40)}
        `
      );
    }
  )
  .demandCommand(1, 1, 'You need to specify a single command')
  .strict()
  .parse();
