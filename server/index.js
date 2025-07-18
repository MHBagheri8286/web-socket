const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const path = require("path");

const PORT = 3001;
const app = express();
const server = http.createServer(app);
app.use("/", express.static(path.resolve(__dirname, "../client/dist")));

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on("connection", function (ws) {
  wss.clients.add(ws);
  ws.on("message", function (data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });
});

server.on("upgrade", async function upgrade(request, socket, head) {
  // Do what you normally do in `verifyClient()` here and then use
  // `WebSocketServer.prototype.handleUpgrade()`.

  // Test for authentication

  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP & WS server running on http://localhost:${PORT}`);
});
