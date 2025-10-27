import compression from 'compression';
import cors from 'cors';
import cronParser from 'cronstrue';
import express from 'express';
import { readFileSync } from 'fs';
import http from 'http';
import cron from 'node-cron';
import path from 'path';
import {
  Unsubscribable,
} from 'rxjs';
import { Server } from 'socket.io';
import Path from 'path';
import { CONFIG } from './config';
import getNetworkInfo from './data/network';
import { getDynamicServerInfo } from './dynamic-info';
import { environment } from './environments/environment';
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
  path: Path.join(CONFIG.routing_path, '/socket'),
});

if (!CONFIG.disable_integrations) {
  app.use(cors());
}

app.use(compression());
app.use(CONFIG.routing_path, router);

if (environment.production) {
  // Serve static files from the React app
  router.use(
    express.static(path.join(__dirname, '../view'), {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (express.static.mime.lookup(path) === 'text/html') {
          res.setHeader('Cache-Control', 'public, max-age=0');
        }
      },
    })
  );
}

// Allow integrations
if (!CONFIG.disable_integrations) {
  const getVersionFile = () => {
    try {
      return JSON.parse(
        readFileSync(path.join(__dirname, '../../../version.json'), 'utf-8')
      );
    } catch (e) {
      console.warn(
        'Version file not found. This is normal on from-source builds.'
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
  console.log('listening on *:' + CONFIG.port);

  await setupHostSpecific();
  await setupNetworking();
  await setupOsVersion();
  await loadStaticServerInfo();
  const obs = getDynamicServerInfo();

  // Allow integrations
  if (!CONFIG.disable_integrations) {
    router.get('/load/cpu', async (_, res) => {
      res.send(await obs.cpu.getCurrentValue());
    });
    router.get('/load/ram', async (_, res) => {
      res.send({ load: await obs.ram.getCurrentValue() });
    });
    router.get('/load/storage', async (_, res) => {
      res.send(await obs.storage.getCurrentValue());
    });
    router.get('/load/network', async (_, res) => {
      res.send(await obs.network.getCurrentValue());
    });
    router.get('/load/gpu', async (_, res) => {
      res.send(await obs.gpu.getCurrentValue());
    });
  }

  // Send current system status
  io.on('connection', socket => {
    const subscriptions: Unsubscribable[] = [];

    subscriptions.push(
      getStaticServerInfoObs().subscribe(staticInfo => {
        socket.emit('static-info', staticInfo);
      })
    );

    subscriptions.push(
      obs.cpu.subscribe(cpu => {
        socket.emit('cpu-load', cpu);
      })
    );

    subscriptions.push(
      obs.ram.subscribe(ram => {
        socket.emit('ram-load', ram);
      })
    );

    subscriptions.push(
      obs.storage.subscribe(async storage => {
        socket.emit('storage-load', storage);
      })
    );

    subscriptions.push(
      obs.network.subscribe(async network => {
        socket.emit('network-load', network);
      })
    );

    subscriptions.push(
      obs.gpu.subscribe(async gpu => {
        socket.emit('gpu-load', gpu);
      })
    );
    socket.on('disconnect', () => {
      subscriptions.forEach(sub => sub.unsubscribe());
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
            } (${cronParser.toString(CONFIG.speed_test_interval_cron)})`
          );
        } else {
          console.warn(
            `Invalid cron expression: ${CONFIG.speed_test_interval_cron}`
          );
        }
      }

      await loadInfo('network', () => getNetworkInfo.speedTest(true), true);
    } catch (e) {
      console.warn(e);
    }

    obs.speedTest.subscribe({
      error: e => console.warn(e),
    });
  }
});

server.on('error', console.error);

process.on('uncaughtException', e => {
  console.error(e);
  tearDownHostSpecific();
  process.exit(1);
});

process.on('unhandledRejection', e => {
  console.error(e);
  tearDownHostSpecific();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  process.exit(0);
});
