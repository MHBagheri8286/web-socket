class UserManager {
    constructor() {
      this.allUsers = [];
      this.typingUsers = [];
      this.messages = [];
    }
  
    addUser(ws, userData) {
      ws.user = userData;
      this.allUsers.push(ws);
    }
  
    removeUser(userName) {
      const userIndex = this.allUsers.findIndex(
        (wsClient) => wsClient.user.name === userName
      );
      if (userIndex !== -1) {
        this.allUsers.splice(userIndex, 1);
      }
    }
  
    addTypingUser(ws) {
      if (!this.typingUsers.includes(ws)) {
        this.typingUsers.push(ws);
      }
    }
  
    removeTypingUser(ws) {
      const typingIndex = this.typingUsers.findIndex(
        (wsClient) => wsClient === ws
      );
      if (typingIndex !== -1) {
        this.typingUsers.splice(typingIndex, 1);
      }
    }
  
    updateUserStatus(userName, status) {
      const user = this.allUsers.find(
        (wsClient) => wsClient.user.name === userName
      );
      if (user) {
        user.user.status = status;
      }
    }
  
    addMessage(user, message) {
      this.messages.push({
        content: message,
        user: user,
      });
    }
  
    getAllUsers() {
      return this.allUsers.map((wsClient) => ({ ...wsClient.user }));
    }
  
    getTypingUsers() {
      return this.typingUsers.map((wsClient) => ({ ...wsClient.user }));
    }
  }
  
  export default UserManager;