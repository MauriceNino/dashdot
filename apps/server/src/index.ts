import { readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { urlJoin } from '@dashdot/common';
import compression from 'compression';
import cors from 'cors';
import cronParser from 'cronstrue';
import express from 'express';
import { lookup as mimeLookup } from 'mime-types';
import cron from 'node-cron';
import {
  debounceTime,
  lastValueFrom,
  type Observable,
  type Subscription,
  take,
  timeout,
} from 'rxjs';
import { Server } from 'socket.io';
import { CONFIG } from './config';
import getNetworkInfo from './data/network';
import { getDynamicServerInfo } from './dynamic-info';
import {
  setupHostSpecific,
  setupNetworking,
  setupOsVersion,
  tearDownHostSpecific,
} from './setup';
import {
  getStaticServerInfo,
  getStaticServerInfoObs,
  loadInfo,
  loadStaticServerInfo,
} from './static-info';

const app = express();
const router = express.Router();
const server = http.createServer(app);
const io = new Server(server, {
  cors: CONFIG.disable_integrations
    ? {}
    : {
        origin: '*',
      },
  path: `/${urlJoin(CONFIG.routing_path, '/socket')}`,
});

if (!CONFIG.disable_integrations) {
  app.use(cors());
}

app.use(compression());
app.use(CONFIG.routing_path, router);

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  router.use(
    express.static(path.join(__dirname, '../../view/dist'), {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (mimeLookup(path) === 'text/html') {
          res.setHeader('Cache-Control', 'public, max-age=0');
        }
      },
    }),
  );
}

// Allow integrations
if (!CONFIG.disable_integrations) {
  const getVersionFile = () => {
    try {
      return JSON.parse(
        readFileSync(path.join(__dirname, '../../../version.json'), 'utf-8'),
      );
    } catch (_e) {
      console.warn(
        'Version file not found. This is normal on from-source builds.',
      );
      return {};
    }
  };

  const versionFile = getVersionFile();
  router.get('/config', (_, res) => {
    res.send({
      config: {
        ...CONFIG,
        overrides: undefined,
      },
      version: versionFile.version,
      buildhash: versionFile.buildhash,
    });
  });

  router.get('/info', (_, res) => {
    res.send({ ...getStaticServerInfo(), config: undefined });
  });
}

// Launch the server
server.listen(CONFIG.port, async () => {
  console.log(`listening on *:${CONFIG.port}`);

  await setupHostSpecific();
  await setupNetworking();
  await setupOsVersion();
  await loadStaticServerInfo();
  const obs = getDynamicServerInfo();

  // Allow integrations
  if (!CONFIG.disable_integrations) {
    const getCurrentValue = async <T>(
      subj: Observable<T>,
    ): Promise<T | undefined> => {
      try {
        return await lastValueFrom(
          subj.pipe(debounceTime(0), timeout(20), take(1)),
        );
      } catch (_e) {
        return undefined;
      }
    };

    router.get('/load/cpu', async (_, res) => {
      res.send(await getCurrentValue(obs.cpu));
    });
    router.get('/load/ram', async (_, res) => {
      res.send({ load: await getCurrentValue(obs.ram) });
    });
    router.get('/load/storage', async (_, res) => {
      res.send(await getCurrentValue(obs.storage));
    });
    router.get('/load/network', async (_, res) => {
      res.send(await getCurrentValue(obs.network));
    });
    router.get('/load/gpu', async (_, res) => {
      res.send(await getCurrentValue(obs.gpu));
    });
  }

  // Send current system status
  io.on('connection', (socket) => {
    const subscriptions: Subscription[] = [];

    subscriptions.push(
      getStaticServerInfoObs().subscribe((staticInfo) => {
        socket.emit('static-info', staticInfo);
      }),
    );

    subscriptions.push(
      obs.cpu.subscribe((cpu) => {
        socket.emit('cpu-load', cpu);
      }),
    );

    subscriptions.push(
      obs.ram.subscribe((ram) => {
        socket.emit('ram-load', ram);
      }),
    );

    subscriptions.push(
      obs.storage.subscribe(async (storage) => {
        socket.emit('storage-load', storage);
      }),
    );

    subscriptions.push(
      obs.network.subscribe(async (network) => {
        socket.emit('network-load', network);
      }),
    );

    subscriptions.push(
      obs.gpu.subscribe(async (gpu) => {
        socket.emit('gpu-load', gpu);
      }),
    );

    socket.on('disconnect', () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe();
      });
    });
  });

  if (CONFIG.widget_list.includes('network')) {
    try {
      console.log('Running speed-test (this may take a few minutes)...');

      if (CONFIG.speed_test_interval_cron) {
        if (cron.validate(CONFIG.speed_test_interval_cron)) {
          console.log(
            `Speed-test interval cron expression: ${
              CONFIG.speed_test_interval_cron
            } (${cronParser.toString(CONFIG.speed_test_interval_cron)})`,
          );
        } else {
          console.warn(
            `Invalid cron expression: ${CONFIG.speed_test_interval_cron}`,
          );
        }
      }

      await loadInfo('network', () => getNetworkInfo.speedTest(true), true);
    } catch (e) {
      console.warn(e);
    }

    obs.speedTest.subscribe({
      error: (e) => console.warn(e),
    });
  }
});

server.on('error', console.error);

process.on('uncaughtException', (e) => {
  console.error(e);
  tearDownHostSpecific();
  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  console.error(e);
  tearDownHostSpecific();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  process.exit(0);
});
