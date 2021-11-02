import cors from 'cors';
import { HardwareInfo } from 'dashdot-shared';
import express, { Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { cpuObs, ramObs, storageObs } from './dynamic-info';
import { getStaticServerInfo } from './static-info';

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
  console.log('user connected');

  const cpuSub = cpuObs.subscribe(async cpu => {
    socket.emit('cpu-load', cpu);
  });

  const ramSub = ramObs.subscribe(async ram => {
    socket.emit('ram-load', ram);
  });

  const storageSub = storageObs.subscribe(async storage => {
    socket.emit('storage-load', storage);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    cpuSub.unsubscribe();
    ramSub.unsubscribe();
    storageSub.unsubscribe();
  });
});

// Launch the server
server.listen(3001, () => {
  console.log('listening on *:3001');
});
