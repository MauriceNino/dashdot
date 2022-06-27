import { loadCommons } from '@dash/common';
import * as cors from 'cors';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as http from 'http';
import * as path from 'path';
import {
  debounceTime,
  lastValueFrom,
  Observable,
  Subscription,
  take,
  timeout,
} from 'rxjs';
import { Server } from 'socket.io';
import { CONFIG } from './config';
import { getDynamicServerInfo } from './dynamic-info';
import { environment } from './environments/environment';
import { setupNetworking } from './setup-networking';
import {
  getStaticServerInfo,
  getStaticServerInfoObs,
  loadStaticServerInfo,
  runSpeedTest,
} from './static-info';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: CONFIG.disable_integrations
    ? {}
    : {
        origin: '*',
      },
});

if (!CONFIG.disable_integrations) {
  app.use(cors());
}

if (environment.production) {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../view')));
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
  });

  // Allow integrations
  if (!CONFIG.disable_integrations) {
    const versionFile = JSON.parse(
      readFileSync(path.join(__dirname, '../../../version.json'), 'utf-8')
    );
    app.get('/config', (_, res) => {
      res.send({
        config: {
          ...CONFIG,
          overrides: undefined,
        },
        version: versionFile.version,
        buildhash: versionFile.buildhash,
      });
    });

    app.get('/info', (_, res) => {
      res.send({ ...getStaticServerInfo(), config: undefined });
    });
  }
}

// Launch the server
server.listen(CONFIG.port, async () => {
  console.log('listening on *:' + CONFIG.port);

  await setupNetworking();
  await loadStaticServerInfo();
  const obs = getDynamicServerInfo();

  // Allow integrations
  if (!CONFIG.disable_integrations) {
    const getCurrentValue = async <T>(
      subj: Observable<T>
    ): Promise<T | undefined> => {
      try {
        return await lastValueFrom(
          subj.pipe(debounceTime(0), timeout(20), take(1))
        );
      } catch (e) {
        return undefined;
      }
    };

    app.get('/load/cpu', async (_, res) => {
      res.send(await getCurrentValue(obs.cpu));
    });
    app.get('/load/ram', async (_, res) => {
      res.send({ load: await getCurrentValue(obs.ram) });
    });
    app.get('/load/storage', async (_, res) => {
      res.send(await getCurrentValue(obs.storage));
    });
    app.get('/load/network', async (_, res) => {
      res.send(await getCurrentValue(obs.network));
    });
    app.get('/load/gpu', async (_, res) => {
      res.send(await getCurrentValue(obs.gpu));
    });
  }

  // Send current system status
  io.on('connection', socket => {
    const subscriptions: Subscription[] = [];

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
      const usedRunner = await runSpeedTest();
      console.log(
        `Speed-test completed successfully [${usedRunner}]`,
        getStaticServerInfo().network
      );
    } catch (e) {
      console.warn(e);
    }

    obs.speedTest.subscribe({
      error: e => console.warn(e),
    });
  }
});

server.on('error', console.error);
loadCommons();
