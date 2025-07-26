const { WebSocket } = require("ws");
const MessageBroadcaster = require("../modules/MessageBroadcaster");

// Mock WebSocket
jest.mock("ws", () => ({
  WebSocket: {
    OPEN: 1,
    CLOSED: 3,
  },
}));

describe("MessageBroadcaster", () => {
  let broadcaster;
  let mockUserManager;
  let mockWs1, mockWs2, mockWs3;

  beforeEach(() => {
    mockWs1 = {
      readyState: WebSocket.OPEN,
      send: jest.fn(),
      user: { name: "Alice", status: "online" },
    };

    mockWs2 = {
      readyState: WebSocket.OPEN,
      send: jest.fn(),
      user: { name: "Bob", status: "online" },
    };

    mockWs3 = {
      readyState: WebSocket.CLOSED,
      send: jest.fn(),
      user: { name: "Charlie", status: "offline" },
    };

    mockUserManager = {
      allUsers: [mockWs1, mockWs2, mockWs3],
      getAllUsers: jest.fn().mockReturnValue([
        { name: "Alice", status: "online" },
        { name: "Bob", status: "online" },
        { name: "Charlie", status: "offline" },
      ]),
      getTypingUsers: jest
        .fn()
        .mockReturnValue([{ name: "Alice", status: "online" }]),
    };

    broadcaster = new MessageBroadcaster(mockUserManager);
  });

  describe("constructor", () => {
    it("should initialize with userManager", () => {
      expect(broadcaster.userManager).toBe(mockUserManager);
    });
  });

  describe("broadcastToAll", () => {
    it("should send message to all open WebSocket connections", () => {
      const eventType = "test_event";
      const data = { test: "data" };

      broadcaster.broadcastToAll(eventType, data);

      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: eventType,
          data: data,
        })
      );
      expect(mockWs2.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: eventType,
          data: data,
        })
      );
      expect(mockWs3.send).not.toHaveBeenCalled(); // Closed connection
    });

    it("should not send to closed connections", () => {
      mockUserManager.allUsers = [mockWs3]; // Only closed connection

      broadcaster.broadcastToAll("test_event", {});

      expect(mockWs3.send).not.toHaveBeenCalled();
    });

    it("should handle empty user list", () => {
      mockUserManager.allUsers = [];

      expect(() => {
        broadcaster.broadcastToAll("test_event", {});
      }).not.toThrow();
    });

    it("should properly serialize complex data", () => {
      const complexData = {
        nested: { object: true },
        array: [1, 2, 3],
        string: "test",
      };

      broadcaster.broadcastToAll("complex_event", complexData);

      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "complex_event",
          data: complexData,
        })
      );
    });
  });

  describe("broadcastAllUsers", () => {
    it("should broadcast all users with correct event type", () => {
      broadcaster.broadcastAllUsers();

      expect(mockUserManager.getAllUsers).toHaveBeenCalled();
      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "all_users",
          data: [
            { name: "Alice", status: "online" },
            { name: "Bob", status: "online" },
            { name: "Charlie", status: "offline" },
          ],
        })
      );
      expect(mockWs2.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "all_users",
          data: [
            { name: "Alice", status: "online" },
            { name: "Bob", status: "online" },
            { name: "Charlie", status: "offline" },
          ],
        })
      );
    });
  });

  describe("broadcastNewMessage", () => {
    it("should broadcast new message with user and message data", () => {
      const user = { name: "Alice", status: "online" };
      const message = "Hello everyone!";

      broadcaster.broadcastNewMessage(user, message);

      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "new_message",
          data: { user, message },
        })
      );
      expect(mockWs2.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "new_message",
          data: { user, message },
        })
      );
    });

    it("should handle empty message", () => {
      const user = { name: "Alice", status: "online" };
      const message = "";

      broadcaster.broadcastNewMessage(user, message);

      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "new_message",
          data: { user, message: "" },
        })
      );
    });
  });

  describe("broadcastTypingUsers", () => {
    it("should broadcast typing users with correct event type", () => {
      broadcaster.broadcastTypingUsers();

      expect(mockUserManager.getTypingUsers).toHaveBeenCalled();
      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "show_typing_users",
          data: [{ name: "Alice", status: "online" }],
        })
      );
      expect(mockWs2.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "show_typing_users",
          data: [{ name: "Alice", status: "online" }],
        })
      );
    });

    it("should handle no typing users", () => {
      mockUserManager.getTypingUsers.mockReturnValue([]);

      broadcaster.broadcastTypingUsers();

      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: "show_typing_users",
          data: [],
        })
      );
    });
  });
});
