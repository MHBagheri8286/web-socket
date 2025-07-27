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
});
