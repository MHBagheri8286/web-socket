class WebSocketEventHandler {
  constructor(userManager, broadcaster) {
    this.userManager = userManager;
    this.broadcaster = broadcaster;
  }

  handleMessage(ws, messageData) {
    try {
      const { event, data } = JSON.parse(messageData);
      
      const eventHandlers = {
        add_user: () => this.handleAddUser(ws, data),
        remove_user: () => this.handleRemoveUser(data),
        add_typing_users: () => this.handleAddTypingUser(ws),
        remove_typing_users: () => this.handleRemoveTypingUser(ws),
        new_message: () => this.handleNewMessage(ws, data),
        update_status: () => this.handleUpdateStatus(data),
      };

      const handler = eventHandlers[event];
      if (handler) {
        handler();
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  handleAddUser(ws, userData) {
    this.userManager.addUser(ws, userData);
    this.broadcaster.broadcastAllUsers();
  }

  handleRemoveUser(userName) {
    this.userManager.removeUser(userName);
    this.broadcaster.broadcastAllUsers();
  }

  handleAddTypingUser(ws) {
    this.userManager.addTypingUser(ws);
    this.broadcaster.broadcastTypingUsers();
  }

  handleRemoveTypingUser(ws) {
    this.userManager.removeTypingUser(ws);
    this.broadcaster.broadcastTypingUsers();
  }

  handleNewMessage(ws, data) {
    this.userManager.addMessage(ws.user, data.message);
    this.broadcaster.broadcastNewMessage(ws.user, data.message);
  }

  handleUpdateStatus(data) {
    this.userManager.updateUserStatus(data.name, data.status);
    this.broadcaster.broadcastAllUsers();
  }
}

export default WebSocketEventHandler;