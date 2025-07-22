import { useRef, useCallback } from 'react';

const WS_URL = 'ws://localhost:3001/server';

export const WS_EVENTS = {
  ADD_USER: 'add_user',
  REMOVE_USER: 'remove_user',
  NEW_MESSAGE: 'new_message',
  UPDATE_STATUS: 'update_status',
  ADD_TYPING: 'add_typing_users',
  REMOVE_TYPING: 'remove_typing_users',
  ALL_USERS: 'all_users',
  SHOW_TYPING: 'show_typing_users',
};

const isSocketOpen = socket => socket?.readyState === WebSocket.OPEN;

const safeJsonParse = data => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const extendWebSocket = ws => {
  ws.emit = (event, data) => {
    if (isSocketOpen(ws)) {
      ws.send(JSON.stringify({ event, data }));
    }
  };

  ws.listen = (eventName, callback) => {
    ws._listeners = ws._listeners || {};
    ws._listeners[eventName] = callback;
  };

  return ws;
};

const useSocket = user => {
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const ws = extendWebSocket(new WebSocket(WS_URL));

    ws.onopen = () => ws.emit(WS_EVENTS.ADD_USER, user);
    ws.onmessage = e => {
      const parsed = safeJsonParse(e.data);
      if (parsed) {
        ws._listeners?.[parsed.event]?.(parsed.data);
      }
    };

    socketRef.current = ws;
  }, [user]);

  const disconnect = useCallback(() => {
    if (isSocketOpen(socketRef.current)) {
      socketRef.current.emit(WS_EVENTS.REMOVE_USER, user.name);
      socketRef.current.close();
    }
    socketRef.current = null;
  }, [user.name]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    emit: useCallback(
      (event, data) => socketRef.current?.emit(event, data),
      []
    ),
    listen: useCallback(
      (event, cb) => socketRef.current?.listen(event, cb),
      []
    ),
  };
};

export default useSocket;
