const WebSocketEventHandler = require("../modules/WebSocketEventHandler");

describe("WebSocketEventHandler", () => {
  let eventHandler;
  let mockUserManager;
  let mockBroadcaster;
  let mockWs;

  beforeEach(() => {
    mockUserManager = {
      addUser: jest.fn(),
      removeUser: jest.fn(),
      addTypingUser: jest.fn(),
      removeTypingUser: jest.fn(),
      addMessage: jest.fn(),
      updateUserStatus: jest.fn(),
    };

    mockBroadcaster = {
      broadcastAllUsers: jest.fn(),
      broadcastNewMessage: jest.fn(),
      broadcastTypingUsers: jest.fn(),
    };

    mockWs = {
      user: { name: "Alice", status: "online" },
    };

    eventHandler = new WebSocketEventHandler(mockUserManager, mockBroadcaster);
  });

  describe("constructor", () => {
    it("should initialize with userManager and broadcaster", () => {
      expect(eventHandler.userManager).toBe(mockUserManager);
      expect(eventHandler.broadcaster).toBe(mockBroadcaster);
    });
  });

  describe("handleMessage", () => {
    it("should handle add_user event", () => {
      const messageData = JSON.stringify({
        event: "add_user",
        data: { name: "Bob", status: "online" },
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addUser).toHaveBeenCalledWith(mockWs, {
        name: "Bob",
        status: "online",
      });
      expect(mockBroadcaster.broadcastAllUsers).toHaveBeenCalled();
    });

    it("should handle remove_user event", () => {
      const messageData = JSON.stringify({
        event: "remove_user",
        data: "Bob",
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.removeUser).toHaveBeenCalledWith("Bob");
      expect(mockBroadcaster.broadcastAllUsers).toHaveBeenCalled();
    });

    it("should handle add_typing_users event", () => {
      const messageData = JSON.stringify({
        event: "add_typing_users",
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addTypingUser).toHaveBeenCalledWith(mockWs);
      expect(mockBroadcaster.broadcastTypingUsers).toHaveBeenCalled();
    });

    it("should handle remove_typing_users event", () => {
      const messageData = JSON.stringify({
        event: "remove_typing_users",
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.removeTypingUser).toHaveBeenCalledWith(mockWs);
      expect(mockBroadcaster.broadcastTypingUsers).toHaveBeenCalled();
    });

    it("should handle new_message event", () => {
      const messageData = JSON.stringify({
        event: "new_message",
        data: { message: "Hello world!" },
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addMessage).toHaveBeenCalledWith(
        mockWs.user,
        "Hello world!"
      );
      expect(mockBroadcaster.broadcastNewMessage).toHaveBeenCalledWith(
        mockWs.user,
        "Hello world!"
      );
    });

    it("should handle update_status event", () => {
      const messageData = JSON.stringify({
        event: "update_status",
        data: { name: "Alice", status: "away" },
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.updateUserStatus).toHaveBeenCalledWith(
        "Alice",
        "away"
      );
      expect(mockBroadcaster.broadcastAllUsers).toHaveBeenCalled();
    });

    it("should ignore unknown events", () => {
      const messageData = JSON.stringify({
        event: "unknown_event",
        data: {},
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addUser).not.toHaveBeenCalled();
      expect(mockUserManager.removeUser).not.toHaveBeenCalled();
      expect(mockBroadcaster.broadcastAllUsers).not.toHaveBeenCalled();
    });

    it("should handle invalid JSON gracefully", () => {
      const invalidJson = "invalid json string";
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      eventHandler.handleMessage(mockWs, invalidJson);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error handling message:",
        expect.any(SyntaxError)
      );
      expect(mockUserManager.addUser).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle missing event property", () => {
      const messageData = JSON.stringify({
        data: { name: "Bob" },
      });

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addUser).not.toHaveBeenCalled();
      expect(mockBroadcaster.broadcastAllUsers).not.toHaveBeenCalled();
    });

    it("should handle empty message data", () => {
      const messageData = JSON.stringify({});

      eventHandler.handleMessage(mockWs, messageData);

      expect(mockUserManager.addUser).not.toHaveBeenCalled();
      expect(mockBroadcaster.broadcastAllUsers).not.toHaveBeenCalled();
    });
  });

  describe("handleAddUser", () => {
    it("should add user and broadcast all users", () => {
      const userData = { name: "Bob", status: "online" };

      eventHandler.handleAddUser(mockWs, userData);

      expect(mockUserManager.addUser).toHaveBeenCalledWith(mockWs, userData);
      expect(mockBroadcaster.broadcastAllUsers).toHaveBeenCalled();
    });
  });

  describe("handleRemoveUser", () => {
    it("should remove user and broadcast all users", () => {
      const userName = "Bob";

      eventHandler.handleRemoveUser(userName);

      expect(mockUserManager.removeUser).toHaveBeenCalledWith(userName);
      expect(mockBroadcaster.broadcastAllUsers).toHaveBeenCalled();
    });
  });
});
