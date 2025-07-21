const WebSocket = require("ws");
const http = require("http");
const express = require("express");
const path = require("path");
const { UserManager, MessageBroadcaster, WebSocketEventHandler } = require("./modules");

class ChatServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.userManager = new UserManager();
    this.broadcaster = new MessageBroadcaster(this.userManager);
    this.eventHandler = new WebSocketEventHandler(this.userManager, this.broadcaster);
    
    this.setupExpress();
    this.setupWebSocket();
  }

  setupExpress() {
    this.app.use("/", express.static(path.resolve(__dirname, "../client/dist")));
  }

  setupWebSocket() {
    this.wss = new WebSocket.Server({ noServer: true });
    
    this.wss.on("connection", (ws) => {
      this.wss.clients.add(ws);
      ws.on("message", (message) => {
        this.eventHandler.handleMessage(ws, message);
      });
    });

    this.server.on("upgrade", (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit("connection", ws, request);
      });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`HTTP & WS server running on http://localhost:${this.port}`);
    });
  }
}

module.exports = ChatServer;