const ChatServer = require('../modules/ChatServer');
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

// Mock dependencies
jest.mock('express');
jest.mock('http');
jest.mock('ws');
jest.mock('../modules/UserManager');
jest.mock('../modules/MessageBroadcaster');
jest.mock('../modules/WebSocketEventHandler');

const { 
  UserManager, 
  MessageBroadcaster, 
  WebSocketEventHandler 
} = require('../modules/index');

describe('ChatServer', () => {
  let chatServer;
  let mockApp;
  let mockServer;
  let mockWss;
  let mockUserManager;
  let mockBroadcaster;
  let mockEventHandler;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock Express app
    mockApp = {
      use: jest.fn()
    };
    express.mockReturnValue(mockApp);
    express.static = jest.fn().mockReturnValue('static-middleware');

    // Mock HTTP server
    mockServer = {
      listen: jest.fn((port, callback) => callback()),
      on: jest.fn()
    };
    http.createServer.mockReturnValue(mockServer);

    // Mock WebSocket Server
    mockWss = {
      on: jest.fn(),
      handleUpgrade: jest.fn()
    };
    WebSocketServer.mockImplementation(() => mockWss);

    // Mock UserManager, MessageBroadcaster, and WebSocketEventHandler
    mockUserManager = {};
    mockBroadcaster = {};
    mockEventHandler = {
      handleMessage: jest.fn()
    };

    UserManager.mockImplementation(() => mockUserManager);
    MessageBroadcaster.mockImplementation(() => mockBroadcaster);
    WebSocketEventHandler.mockImplementation(() => mockEventHandler);

    chatServer = new ChatServer(3001);
  });

  describe('constructor', () => {
    it('should initialize with correct port', () => {
      expect(chatServer.port).toBe(3001);
    });

    it('should create Express app', () => {
      expect(express).toHaveBeenCalled();
      expect(chatServer.app).toBe(mockApp);
    });

    it('should create HTTP server', () => {
      expect(http.createServer).toHaveBeenCalledWith(mockApp);
      expect(chatServer.server).toBe(mockServer);
    });

    it('should create UserManager instance', () => {
      expect(UserManager).toHaveBeenCalled();
      expect(chatServer.userManager).toBe(mockUserManager);
    });

    it('should create MessageBroadcaster instance with UserManager', () => {
      expect(MessageBroadcaster).toHaveBeenCalledWith(mockUserManager);
      expect(chatServer.broadcaster).toBe(mockBroadcaster);
    });

    it('should create WebSocketEventHandler with dependencies', () => {
      expect(WebSocketEventHandler).toHaveBeenCalledWith(mockUserManager, mockBroadcaster);
      expect(chatServer.eventHandler).toBe(mockEventHandler);
    });

    it('should create WebSocketServer with noServer option', () => {
      expect(WebSocketServer).toHaveBeenCalledWith({ noServer: true });
      expect(chatServer.wss).toBe(mockWss);
    });
  });
});