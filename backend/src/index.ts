import cors from "cors";
import { OsInfo } from "dashdot-shared";
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
app.get("/system-info", async (_, res: Response<OsInfo>) => {
  const osInfo = await si.osInfo();
  const time = await si.time();

  res.send({
    arch: osInfo.arch,
    distro: osInfo.distro,
    kernel: osInfo.kernel,
    platform: osInfo.platform,
    release: osInfo.release,

    uptime: +time.uptime,
  });
});

// Launch the server
const server = http.createServer(app);
server.listen(3001, () => {
  console.log("listening on *:3001");
});
