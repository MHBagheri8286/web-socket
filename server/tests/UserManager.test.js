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

  describe('removeTypingUser', () => {
    beforeEach(() => {
      userManager.typingUsers.push(mockWs1, mockWs2);
    });

    it('should remove a typing user', () => {
      userManager.removeTypingUser(mockWs1);

      expect(userManager.typingUsers).toHaveLength(1);
      expect(userManager.typingUsers[0]).toBe(mockWs2);
    });

    it('should not remove anything if user is not in typing list', () => {
      const mockWs3 = { user: { name: 'Charlie' } };
      userManager.removeTypingUser(mockWs3);

      expect(userManager.typingUsers).toHaveLength(2);
      expect(userManager.typingUsers).toContain(mockWs1);
      expect(userManager.typingUsers).toContain(mockWs2);
    });
  });

  describe('updateUserStatus', () => {
    beforeEach(() => {
      userManager.allUsers.push(mockWs1, mockWs2);
    });

    it('should update user status', () => {
      userManager.updateUserStatus('Alice', 'away');

      expect(mockWs1.user.status).toBe('away');
    });

    it('should not update status if user does not exist', () => {
      userManager.updateUserStatus('Charlie', 'away');

      expect(mockWs1.user.status).toBe('online');
      expect(mockWs2.user.status).toBe('online');
    });
  });

  describe('addMessage', () => {
    it('should add a message to the messages array', () => {
      const user = { name: 'Alice', status: 'online' };
      const message = 'Hello, world!';

      userManager.addMessage(user, message);

      expect(userManager.messages).toHaveLength(1);
      expect(userManager.messages[0]).toEqual({
        content: message,
        user: user
      });
    });

    it('should add multiple messages', () => {
      const user1 = { name: 'Alice', status: 'online' };
      const user2 = { name: 'Bob', status: 'online' };
      const message1 = 'Hello!';
      const message2 = 'Hi there!';

      userManager.addMessage(user1, message1);
      userManager.addMessage(user2, message2);

      expect(userManager.messages).toHaveLength(2);
      expect(userManager.messages[0]).toEqual({ content: message1, user: user1 });
      expect(userManager.messages[1]).toEqual({ content: message2, user: user2 });
    });
  });


  describe('getTypingUsers', () => {
    it('should return empty array when no typing users', () => {
      const typingUsers = userManager.getTypingUsers();

      expect(typingUsers).toEqual([]);
    });

    it('should return array of typing user objects', () => {
      userManager.typingUsers.push(mockWs1, mockWs2);

      const typingUsers = userManager.getTypingUsers();

      expect(typingUsers).toHaveLength(2);
      expect(typingUsers[0]).toEqual({ name: 'Alice', status: 'online' });
      expect(typingUsers[1]).toEqual({ name: 'Bob', status: 'online' });
    });

    it('should return copies of user objects, not references', () => {
      userManager.typingUsers.push(mockWs1);

      const typingUsers = userManager.getTypingUsers();
      typingUsers[0].name = 'Modified';

      expect(mockWs1.user.name).toBe('Alice');
    });
  });
});
