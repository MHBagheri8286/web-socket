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

const typingUsers = [];
const messages = [];
const allUsers = [];

function updateAllUser() {
  allUsers.forEach((wsClient) => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(
        JSON.stringify({
          event: "all_users",
          data: allUsers.map((wsClient) => ({ ...wsClient.user })),
        })
      );
    }
  });
}

function broadcastNewMessage(user, message) {
  allUsers.forEach((wsClient) => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(
        JSON.stringify({
          event: "new_message",
          data: { user, message },
        })
      );
    }
  });
}

function broadcastTypingUsers() {
  allUsers.forEach((wsClient) => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(
        JSON.stringify({
          event: "show_typing_users",
          data: typingUsers
            .map((wsClient) => ({ ...wsClient.user })),
        })
      );
    }
  });
}

wss.on("connection", function (ws) {
  wss.clients.add(ws);
  ws.on("message", function (message) {
    try {
      const { event, data } = JSON.parse(message);
      switch (event) {
        case "add_user": {
          ws.user = data;
          allUsers.push(ws);
          updateAllUser();
          break;
        }
        case "remove_user": {
          const findIndex = allUsers.findIndex(
            (wsClient) => wsClient.user.name === data
          );
          if (findIndex !== -1) {
            allUsers.splice(findIndex, 1);
          }
          break;
        }
        case "add_typing_users": {
          typingUsers.push(ws);
          broadcastTypingUsers();
          break;
        }
        case "remove_typing_users": {
          const findIndex = typingUsers.findIndex(
            (wsClient) => wsClient === ws
          );
          if (findIndex !== -1) {
            typingUsers.splice(findIndex, 1);
          }
          broadcastTypingUsers(ws.user);
          break;
        }
        case "new_message": {
          messages.push({
            content: data.message,
            user: ws.user,
          });
          broadcastNewMessage(ws.user, data.message);
          break;
        }

        case "update_status": {
          const findWsClient = allUsers.find(
            (wsClient) => wsClient.user.name === data.name
          );
          findWsClient.user.status = data.status;

          updateAllUser();
          break;
        }

        default:
          break;
      }
    } catch (error) {}
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
