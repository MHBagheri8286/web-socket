import { useEffect, useRef, useState } from "react";

export function useChat(user, register, reset, clearErrors) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    WebSocket.prototype.emit = function (event, data) {
      this.send(JSON.stringify({ event, data }));
    };

    WebSocket.prototype.listen = function (eventName, callback) {
      this._socketListeners = this._socketListeners || {};
      this._socketListeners[eventName] = callback;
    };
  }, []);

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

      socketRef.current.onclose = () => {
        socketRef.current.emit("remove_user", user.name);
        socketRef.current = null;
      };
    }

    // Appending new message
    socketRef.current.listen("new_message", (data) => {
      chats.push(data);
      setChats(chats.slice());
      console.log(chats);
    });

    socketRef.current.listen("all_users", (data) => {
      setUsers(data);
    });

    socketRef.current.listen("show_typing_users", (data) => {
console.log(data);

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
          console.log("User returned to chat");
          socketRef.current.emit("update_status", {
            ...user,
            status: "online",
          });
        } else {
          console.log("User left chat tab");
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
    // Add beforeunload listener
    window.addEventListener("beforeunload", closeSocket);

    return () => {
      // Remove beforeunload listener
      window.removeEventListener("beforeunload", closeSocket);
    };

    function closeSocket() {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.close();
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
    onSubmit,
    handleClearChat,
    handleTyping,
    stopTyping,
  };
}
