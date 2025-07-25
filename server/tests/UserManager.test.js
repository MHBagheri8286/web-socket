const UserManager = require("../modules/UserManager");

describe("UserManager", () => {
  let userManager;
  let mockWs1, mockWs2;

  beforeEach(() => {
    userManager = new UserManager();
    mockWs1 = {
      user: { name: "Alice", status: "online" },
    };
    mockWs2 = {
      user: { name: "Bob", status: "online" },
    };
  });

  describe("addUser", () => {
    it("should add a user to the allUsers array", () => {
      const userData = { name: "Alice", status: "online" };
      const mockWs = {};

      userManager.addUser(mockWs, userData);

      expect(mockWs.user).toEqual(userData);
      expect(userManager.allUsers).toContain(mockWs);
      expect(userManager.allUsers).toHaveLength(1);
    });

    it("should add multiple users", () => {
      const userData1 = { name: "Alice", status: "online" };
      const userData2 = { name: "Bob", status: "away" };
      const mockWs1 = {};
      const mockWs2 = {};

      userManager.addUser(mockWs1, userData1);
      userManager.addUser(mockWs2, userData2);

      expect(userManager.allUsers).toHaveLength(2);
      expect(mockWs1.user).toEqual(userData1);
      expect(mockWs2.user).toEqual(userData2);
    });
  });

  describe("removeUser", () => {
    beforeEach(() => {
      userManager.allUsers.push(mockWs1, mockWs2);
    });

    it("should remove a user by name", () => {
      userManager.removeUser("Alice");

      expect(userManager.allUsers).toHaveLength(1);
      expect(userManager.allUsers[0]).toBe(mockWs2);
    });

    it("should not remove anything if user name does not exist", () => {
      userManager.removeUser("Charlie");

      expect(userManager.allUsers).toHaveLength(2);
      expect(userManager.allUsers).toContain(mockWs1);
      expect(userManager.allUsers).toContain(mockWs2);
    });

    it("should handle empty user list", () => {
      userManager.allUsers = [];
      userManager.removeUser("Alice");

      expect(userManager.allUsers).toHaveLength(0);
    });
  });

  describe("addTypingUser", () => {
    it("should add a user to typing users", () => {
      userManager.addTypingUser(mockWs1);

      expect(userManager.typingUsers).toContain(mockWs1);
      expect(userManager.typingUsers).toHaveLength(1);
    });

    it("should not add duplicate typing user", () => {
      userManager.addTypingUser(mockWs1);
      userManager.addTypingUser(mockWs1);

      expect(userManager.typingUsers).toHaveLength(1);
      expect(userManager.typingUsers[0]).toBe(mockWs1);
    });

    it("should add multiple different typing users", () => {
      userManager.addTypingUser(mockWs1);
      userManager.addTypingUser(mockWs2);

      expect(userManager.typingUsers).toHaveLength(2);
      expect(userManager.typingUsers).toContain(mockWs1);
      expect(userManager.typingUsers).toContain(mockWs2);
    });
  });
});
