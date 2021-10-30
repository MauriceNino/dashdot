import cors from "cors";
import { HardwareInfo } from "dashdot-shared";
import express, { Response } from "express";
import http from "http";
import path from "path";
import { getStaticServerInfo } from "./static-info";

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
  res.send(await getStaticServerInfo());
});

// Launch the server
const server = http.createServer(app);
server.listen(3001, () => {
  console.log("listening on *:3001");
});
