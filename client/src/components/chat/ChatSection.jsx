const ChatSection = props => {
  const {
    chats,
    typingUsers,
    register,
    handleSubmit,
    handleClearChat,
    onSubmit,
    handleTyping,
    errors,
  } = props;

  const handleInputChange = e => {
    register('message').onChange(e);
    handleTyping(e);
  };

  return (
    <div className="col-lg-9 col-md-8">
      <div className="card h-100">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-chat-left-text me-2"></i>
            Messages
          </h6>
        </div>
        <div className="chat-messages p-2">
          {chats.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
              <i className="bi bi-chat-square-dots fs-1 mb-3"></i>
              <p className="mb-0">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={index}
                className="message-item p-3 mb-2 bg-white rounded"
              >
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0">
                    <div
                      className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <span className="text-white font-weight-bold">
                        {chat.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex align-items-center mb-1">
                      <span className="message-user me-2">
                        {chat.user?.name}
                      </span>
                      <small className="text-muted">
                        {new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </div>
                    <p className="message-content">{chat.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="typing-section p-2">
          {typingUsers.length > 0 ? (
            typingUsers.map((typingUser, index) => (
              <div key={index} className="typing-indicator small">
                <span>{typingUser?.name} is typing</span>
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted small">
              <i className="bi bi-keyboard me-1"></i>
              Type a message...
            </div>
          )}
        </div>
        <div className="card-footer message-input-section">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-2">
              <div className="col">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-chat"></i>
                  </span>
                  <input
                    {...register('message')}
                    id="sentMessage"
                    type="text"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    placeholder="Type your message here..."
                    autoComplete="off"
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="btn btn-gradient-primary">
                    <i className="bi bi-send"></i>
                  </button>
                </div>
                {errors.message && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    {errors.message.message}
                  </div>
                )}
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-gradient-warning"
                  onClick={handleClearChat}
                  title="Clear chat input"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
