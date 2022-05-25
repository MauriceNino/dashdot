import cors from 'cors';
import { HardwareInfo } from 'dashdot-shared';
import express, { Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import util from 'util';
import { CONFIG } from './config';
import { cpuObs, netowrkObs, ramObs, storageObs } from './dynamic-info';
import { getStaticServerInfo, runSpeedTest } from './static-info';

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../../frontend/build')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Send general system information
app.get('/system-info', async (_, res: Response<HardwareInfo>) => {
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
    util.inspect(await getStaticServerInfo(), {
      showHidden: false,
      depth: null,
      colors: true,
    })
  );

  await runSpeedTest();
});
