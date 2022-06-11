import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
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
    const cpuSub = obs.cpu.subscribe(cpu => {
      socket.emit('cpu-load', cpu);
    });

    const ramSub = obs.ram.subscribe(ram => {
      socket.emit('ram-load', ram);
    });

    const storageSub = obs.storage.subscribe(async storage => {
      socket.emit('storage-load', storage);
    });

    const networkSub = obs.network.subscribe(async network => {
      socket.emit('network-load', network);
    });

    socket.on('disconnect', () => {
      cpuSub.unsubscribe();
      ramSub.unsubscribe();
      storageSub.unsubscribe();
      networkSub.unsubscribe();
    });
  });

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
});

server.on('error', console.error);
