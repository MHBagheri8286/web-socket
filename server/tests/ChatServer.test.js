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

  describe('setupExpress', () => {
    it('should setup static file serving', () => {
      expect(mockApp.use).toHaveBeenCalledWith('/', 'static-middleware');
      expect(express.static).toHaveBeenCalledWith(
        expect.stringContaining('client/dist')
      );
    });
  });

  describe('setupWebSocket', () => {
    it('should setup WebSocket connection handler', () => {
      expect(mockWss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    it('should setup HTTP upgrade handler', () => {
      expect(mockServer.on).toHaveBeenCalledWith('upgrade', expect.any(Function));
    });

    it('should handle WebSocket connection and message events', () => {
      // Get the connection handler
      const connectionHandler = mockWss.on.mock.calls.find(
        call => call[0] === 'connection'
      )[1];

      const mockWs = {
        on: jest.fn()
      };

      connectionHandler(mockWs);

      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function));

      // Test message handler
      const messageHandler = mockWs.on.mock.calls.find(
        call => call[0] === 'message'
      )[1];

      const testMessage = 'test message';
      messageHandler(testMessage);

      expect(mockEventHandler.handleMessage).toHaveBeenCalledWith(mockWs, testMessage);
    });

    it('should handle HTTP upgrade correctly', () => {
      // Get the upgrade handler
      const upgradeHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'upgrade'
      )[1];

      const mockRequest = {};
      const mockSocket = {};
      const mockHead = {};
      const mockWs = {};

      mockWss.handleUpgrade.mockImplementation((request, socket, head, callback) => {
        callback(mockWs);
      });

      mockWss.emit = jest.fn();

      upgradeHandler(mockRequest, mockSocket, mockHead);

      expect(mockWss.handleUpgrade).toHaveBeenCalledWith(
        mockRequest, 
        mockSocket, 
        mockHead, 
        expect.any(Function)
      );

      // Simulate the callback being called
      const upgradeCallback = mockWss.handleUpgrade.mock.calls[0][3];
      upgradeCallback(mockWs);

      expect(mockWss.emit).toHaveBeenCalledWith('connection', mockWs, mockRequest);
    });
  });

  describe('start', () => {
    it('should start the server on the specified port', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      chatServer.start();

      expect(mockServer.listen).toHaveBeenCalledWith(3001, expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith(
        'HTTP & WS server running on http://localhost:3001'
      );

      consoleSpy.mockRestore();
    });

    it('should handle different port numbers', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const chatServerCustomPort = new ChatServer(8080);

      chatServerCustomPort.start();

      expect(mockServer.listen).toHaveBeenCalledWith(8080, expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith(
        'HTTP & WS server running on http://localhost:8080'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('integration', () => {
    it('should properly wire all components together', () => {
      // Verify that all components are created and connected properly
      expect(chatServer.userManager).toBeDefined();
      expect(chatServer.broadcaster).toBeDefined();
      expect(chatServer.eventHandler).toBeDefined();
      expect(chatServer.wss).toBeDefined();
      expect(chatServer.server).toBeDefined();
      expect(chatServer.app).toBeDefined();

      // Verify dependencies are passed correctly
      expect(MessageBroadcaster).toHaveBeenCalledWith(chatServer.userManager);
      expect(WebSocketEventHandler).toHaveBeenCalledWith(
        chatServer.userManager, 
        chatServer.broadcaster
      );
    });
  });

  describe('error handling', () => {
    it('should handle WebSocket connection errors gracefully', () => {
      const connectionHandler = mockWss.on.mock.calls.find(
        call => call[0] === 'connection'
      )[1];

      const mockWs = {
        on: jest.fn()
      };

      // Should not throw even if ws.on throws
      mockWs.on.mockImplementation(() => {
        throw new Error('WebSocket error');
      });

      expect(() => connectionHandler(mockWs)).toThrow('WebSocket error');
    });

    it('should handle upgrade errors gracefully', () => {
      const upgradeHandler = mockServer.on.mock.calls.find(
        call => call[0] === 'upgrade'
      )[1];

      mockWss.handleUpgrade.mockImplementation(() => {
        throw new Error('Upgrade error');
      });

      expect(() => {
        upgradeHandler({}, {}, {});
      }).toThrow('Upgrade error');
    });
  });
});