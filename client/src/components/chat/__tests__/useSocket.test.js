import { renderHook, act } from '@testing-library/react';
import useSocket from '../useSocket';

// Simple WebSocket mock
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  onopen: null,
  onmessage: null
};

global.WebSocket = jest.fn(() => mockWebSocket);
global.WebSocket.OPEN = 1;

describe('useSocket', () => {
  const mockUser = { name: 'test', status: 'online' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocket.readyState = 1;
  });

  test('creates socket connection', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
    });

    expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost:3001/server');
  });

  test('emits add_user on connection', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
    });

    // Simulate connection opening
    act(() => {
      mockWebSocket.onopen();
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ event: 'add_user', data: mockUser })
    );
  });

  test('sends message when emit is called', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
      result.current.emit('test_event', { data: 'test' });
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({ event: 'test_event', data: { data: 'test' } })
    );
  });

  test('closes connection on disconnect', () => {
    const { result } = renderHook(() => useSocket(mockUser));
    
    act(() => {
      result.current.connect();
      result.current.disconnect();
    });

    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});