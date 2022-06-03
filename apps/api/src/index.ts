import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { interval, mergeMap } from 'rxjs';
import { Server } from 'socket.io';
import { inspect } from 'util';
import { CONFIG } from './config';
import { cpuObs, netowrkObs, ramObs, storageObs } from './dynamic-info';
import { environment } from './environments/environment';
import { setupNetworking } from './setup-networking';
import { getStaticServerInfo, runSpeedTest } from './static-info';

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

// Send general system information
app.get('/system-info', async (_, res) => {
  res.send(await getStaticServerInfo());
});

// Send current system status
io.on('connection', socket => {
  const cpuSub = cpuObs.subscribe(async cpu => {
    socket.emit('cpu-load', cpu);
  });

  const ramSub = ramObs.subscribe(async ram => {
    socket.emit('ram-load', ram);
  });

  const storageSub = storageObs.subscribe(async storage => {
    socket.emit('storage-load', storage);
  });

  const networkSub = netowrkObs.subscribe(async network => {
    socket.emit('network-load', network);
  });

  socket.on('disconnect', () => {
    cpuSub.unsubscribe();
    ramSub.unsubscribe();
    storageSub.unsubscribe();
    networkSub.unsubscribe();
  });
});

// Launch the server
server.listen(CONFIG.port, async () => {
  console.log('listening on *:' + CONFIG.port);

  console.log(
    'Static Server Info:',
    inspect(await getStaticServerInfo(), {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );

  await setupNetworking();

  console.log('Running speed-test (this may take a few minutes)...');
  try {
    console.log(
      inspect(await runSpeedTest(), {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
  } catch (e) {
    console.error(e);
  }

  // Run speed test every CONFIG.speed_test_interval minutes
  interval(CONFIG.speed_test_interval * 60 * 1000)
    .pipe(mergeMap(async () => await runSpeedTest()))
    .subscribe({
      error: e => console.error(e),
    });
});

server.on('error', console.error);
