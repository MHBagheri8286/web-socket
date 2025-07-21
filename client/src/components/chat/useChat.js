import { useEffect, useRef, useState } from "react";

WebSocket.prototype.emit = function (event, data) {
  this.send(JSON.stringify({ event, data }));
};

WebSocket.prototype.listen = function (eventName, callback) {
  this._socketListeners = this._socketListeners || {};
  this._socketListeners[eventName] = callback;
};

export function useChat(user, reset, clearErrors) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      const url = `ws://localhost:3001/server`;
      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("Websocket is live");
        socketRef.current.emit("add_user", { ...user });
      };

      socketRef.current.onmessage = (messageEvent) => {
        try {
          const { event, data } = JSON.parse(messageEvent.data);
          socketRef.current._socketListeners?.[event](data);
        } catch (error) {}
      };
    }

    socketRef.current.listen("all_users", (data) => {
      setUsers(data);
    });

    socketRef.current.listen("new_message", (data) => {
      chats.push(data);
      setChats(chats.slice());
    });

    socketRef.current.listen("show_typing_users", (data) => {
      setTypingUsers(data.filter(x=> x.name !== user.name));
    });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        if (isVisible) {
          socketRef.current.emit("update_status", {
            ...user,
            status: "online",
          });
        } else {
          socketRef.current.emit("update_status", {
            ...user,
            status: "offline",
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", removeUser);

    return () => {
      removeUser();
      window.removeEventListener("beforeunload", removeUser);
    };

    function removeUser() {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.emit("remove_user", user.name);
        socketRef.current = null;
      }
    }
  }, []);

  const onSubmit = (data) => {
    stopTyping();
    const { message } = data;
    socketRef.current.emit("new_message", { message });
    reset({ message: "" });
    clearErrors();
  };

  const handleClearChat = () => {
    reset({ message: "" });
    clearErrors();
  };

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("add_typing_users");
      console.log("start typing");
    }
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socketRef.current.emit("remove_typing_users");
      console.log("stop typing");
    }
  };

  const handleTyping = (e) => {
    if (e.target.value.trim().length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return {
    users,
    chats,
    typingUsers,
    onSubmit,
    handleClearChat,
    handleTyping,
    stopTyping,
  };
}
