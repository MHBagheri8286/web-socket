import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import ChatSection from './ChatSection';
import './layout.css';
import OnlineUserSection from './OnlineUsersSection';
import { useChat } from './useChat';

const ChatSchema = yup.object({
  message: yup.string().required('Message is required'),
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

  const {
    chats,
    users,
    typingUsers,
    onSubmit,
    handleClearChat,
    handleTyping,
  } = useChat(user, reset, clearErrors);

  return (
    <div className="main-container">
      <div className="container-fluid">
        <div className="card chat-container rounded-4 fade-in">
          <div className="chat-header rounded-top-4">
            <h1 className="mb-0">
              <i className="bi bi-chat-dots me-2"></i>
              Let's Chat!
            </h1>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <OnlineUserSection users={users} />
              <ChatSection
                chats={chats}
                typingUsers={typingUsers}
                register={register}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                handleClearChat={handleClearChat}
                handleTyping={handleTyping}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
