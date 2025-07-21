import { WebSocket } from "ws";

class MessageBroadcaster {
  constructor(userManager) {
    this.userManager = userManager;
  }

  broadcastToAll(eventType, data) {
    this.userManager.allUsers.forEach((wsClient) => {
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(
          JSON.stringify({
            event: eventType,
            data: data,
          })
        );
      }
    });
  }

  broadcastAllUsers() {
    this.broadcastToAll("all_users", this.userManager.getAllUsers());
  }

  broadcastNewMessage(user, message) {
    this.broadcastToAll("new_message", { user, message });
  }

  broadcastTypingUsers() {
    this.broadcastToAll("show_typing_users", this.userManager.getTypingUsers());
  }
}

export default MessageBroadcaster;