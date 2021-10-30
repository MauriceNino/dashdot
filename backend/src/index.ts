import cors from "cors";
import {
  CpuInfo,
  HardwareInfo,
  OsInfo,
  RamInfo,
  StorageInfo,
} from "dashdot-shared";
import express, { Response } from "express";
import http from "http";
import path from "path";
import si from "systeminformation";

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "../../frontend/build")));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

// Send general system information
app.get("/system-info", async (_, res: Response<HardwareInfo>) => {
  const [osInfo, timeInfo, cpuInfo, memInfo, memLayout, diskLayout] =
    await Promise.all([
      si.osInfo(),
      si.time(),
      si.cpu(),
      si.mem(),
      si.memLayout(),
      si.diskLayout(),
    ]);

  const os: OsInfo = {
    arch: osInfo.arch,
    distro: osInfo.distro,
    kernel: osInfo.kernel,
    platform: osInfo.platform,
    release: osInfo.release,

    uptime: +timeInfo.uptime,
  };

  const cpu: CpuInfo = {
    manufacturer: cpuInfo.manufacturer,
    brand: cpuInfo.brand,
    speed: cpuInfo.speed,
    cores: cpuInfo.physicalCores,
    threads: cpuInfo.cores,
  };

  const ram: RamInfo = {
    total: memInfo.total,
    layout: memLayout.map(({ manufacturer, type, clockSpeed }) => ({
      manufacturer,
      type,
      clockSpeed: clockSpeed ?? undefined,
    })),
  };

  const storage: StorageInfo = {
    layout: diskLayout.map(({ size, type, name }) => ({
      size,
      type,
      name,
    })),
  };

  res.send({
    os,
    cpu,
    ram,
    storage,
  });
});

// Launch the server
const server = http.createServer(app);
server.listen(3001, () => {
  console.log("listening on *:3001");
});
