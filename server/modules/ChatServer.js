import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import {
  MessageBroadcaster,
  UserManager,
  WebSocketEventHandler,
} from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChatServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.userManager = new UserManager();
    this.broadcaster = new MessageBroadcaster(this.userManager);
    this.eventHandler = new WebSocketEventHandler(
      this.userManager,
      this.broadcaster
    );

    this.setupExpress();
    this.setupWebSocket();
  }

  setupExpress() {
    this.app.use(
      "/",
      express.static(path.resolve(__dirname, "../../client/dist"))
    );
  }

  setupWebSocket() {
    this.wss = new WebSocketServer({ noServer: true });

    this.wss.on("connection", (ws) => {
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

export default ChatServer;
