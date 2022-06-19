import { loadCommons } from '@dash/common';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { Subscription } from 'rxjs';
import { Server } from 'socket.io';
import { CONFIG } from './config';
import { getDynamicServerInfo } from './dynamic-info';
import { environment } from './environments/environment';
import { setupNetworking } from './setup-networking';
import {
  getStaticServerInfo,
  loadStaticServerInfo,
  runSpeedTest,
} from './static-info';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

if (environment.production) {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../view')));
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../view', 'index.html'));
  });
}

// Launch the server
server.listen(CONFIG.port, async () => {
  console.log('listening on *:' + CONFIG.port);

  await setupNetworking();
  await loadStaticServerInfo();
  const obs = getDynamicServerInfo();

  // Send general system information
  app.get('/system-info', async (_, res) => {
    res.send(getStaticServerInfo());
  });

  // Send current system status
  io.on('connection', socket => {
    const subscriptions: Subscription[] = [];

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
