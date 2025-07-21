import React from "react";
import { useChat } from "./useChat";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const ChatSchema = yup.object({
  message: yup.string().required(),
});

const Chat = ({ user }) => {
  const {
    formState: { errors },
    register,
    reset,
    clearErrors,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(ChatSchema),
  });

  const { chats, users, typingUsers, onSubmit, handleClearChat, handleTyping, stopTyping } =
    useChat(user, reset, register, clearErrors);

  const handleInputChange = (e) => {
    register("message").onChange(e);
    handleTyping(e);
  };

  const handleInputBlur = (e) => {
    register("message").onBlur(e);
    stopTyping();
  };

  return (
    <div className="chat-section">
      <h1 className="text-center">Let's Chat!</h1>
      <div className="row">
        <div className="col-md-3 col-md-offset-0">
          <div className="well">
            <h4>Online Users:</h4>
            <ul className="users">
              {users.map((user, index) => (
                <li key={index}>
                  {user.name} {user.status}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-8 chat-div">
          <div className="chats">
            {chats.map((chat, index)=> <div key={index}>{`${chat.user?.name}: ${chat.message}`}</div>)}
          </div>
          <div className="typing-users">
            {typingUsers.map((user, index)=> <div key={index}>{`${user?.name} is typing`}</div>)}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="well" id="typeMsgSection">
              <label htmlFor="sentMessage" className="people-typing">
                Type Message:
              </label>
              <input
                {...register("message")}
                id="sentMessage"
                type="text"
                className="form-control"
                placeholder="Enter message"
                autoComplete="off"
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.message && (
                <div className="alert alert-danger">
                  <p>{errors.message.message}</p>
                </div>
              )}
              <div className="row">
                <div className="col-md-10">
                  <button type="submit" className="btn btn-block btn-primary">
                    Send
                  </button>
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleClearChat}
                  >
                    Clear Chat
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
