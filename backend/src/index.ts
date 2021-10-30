import express from "express";
import http from "http";
import path from "path";

const app = express();
const server = http.createServer(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
