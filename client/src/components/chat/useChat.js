import { useEffect, useState, useCallback } from "react";
import useSocket, { WS_EVENTS } from './useSocket';
import useTyping from './useTyping';
import useUserStatus from './useUserStatus';
import useFormActions from './useFormAction';

const createStateUpdaters = (currentUser) => ({
  addChat: useCallback((setChats) => (chat) => 
    setChats(prev => [...prev, chat]), []),
  
  updateTypingUsers: useCallback((setTypingUsers) => (users) => 
    setTypingUsers(users.filter(u => u.name !== currentUser.name)), [currentUser.name])
});

export function useChat(user, reset, clearErrors) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  const socket = useSocket(user);
  const typing = useTyping(socket.emit);
  const form = useFormActions(
    reset,
    clearErrors,
    socket.emit,
    typing.stopTyping
  );

  useUserStatus(user, socket.emit);

  const stateUpdaters = createStateUpdaters(user);
  const addChat = stateUpdaters.addChat(setChats);
  const updateTypingUsers = stateUpdaters.updateTypingUsers(setTypingUsers);

  useEffect(() => {
    socket.connect();
    return socket.disconnect;
  }, [socket.connect, socket.disconnect]);

  useEffect(() => {
    socket.listen(WS_EVENTS.ALL_USERS, setUsers);
    socket.listen(WS_EVENTS.NEW_MESSAGE, addChat);
    socket.listen(WS_EVENTS.SHOW_TYPING, updateTypingUsers);
  }, [socket.listen, addChat, updateTypingUsers]);

  useEffect(() => {
    const cleanup = socket.disconnect;
    window.addEventListener('beforeunload', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [socket.disconnect]);

  return {
    users,
    chats,
    typingUsers,
    onSubmit: form.onSubmit,
    handleClearChat: form.handleClearChat,
    handleTyping: typing.handleTyping,
  };
}
