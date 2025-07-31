// Mock WebSocket
global.WebSocket = jest.fn(() => ({
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1
  }));
  
  WebSocket.OPEN = 1;  