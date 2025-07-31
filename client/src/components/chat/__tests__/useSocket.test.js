import { renderHook, act } from '@testing-library/react';
import useSocket from '../useSocket';

// Create a shared mock that we can assert on
let mockWebSocketInstance;

const createMockWebSocket = () => {
  const ws = {
    send: jest.fn(),
    close: jest.fn(),
    readyState: 1,
    onopen: null,
    onmessage: null,
    _listeners: {}
  };
  
  // Add the emit method that extendWebSocket adds
  ws.emit = (event, data) => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(JSON.stringify({ event, data }));
    }
  };
  
  ws.listen = (eventName, callback) => {
    ws._listeners = ws._listeners || {};
    ws._listeners[eventName] = callback;
  };
  
  mockWebSocketInstance = ws;
  return ws;
};

global.WebSocket = jest.fn(() => createMockWebSocket());

describe('useSocket', () => {
  const mockUser = { name: 'test', status: 'online' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocketInstance = null;
  });

  test('creates socket connection', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
    });

    expect(global.WebSocket).toHaveBeenCalled();
  });

  test('sends message when emit is called', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
      result.current.emit('test_event', { data: 'test' });
    });

    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(
      JSON.stringify({ event: 'test_event', data: { data: 'test' } })
    );
  });
});