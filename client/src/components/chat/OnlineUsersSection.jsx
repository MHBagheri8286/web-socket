const OnlineUserSection = ({ users }) => {
  return (
    <div className="col-lg-3 col-md-4">
      <div className="card h-100 users-section">
        <div className="users-header rounded-top">
          <i className="bi bi-people-fill me-2"></i>
          Online Users ({users.length})
        </div>
        <div className="card-body p-0">
          <div className="users-list">
            {users.length === 0 ? (
              <div className="text-center text-muted p-3">
                <i className="bi bi-person-x fs-2 d-block mb-2"></i>
                No users online
              </div>
            ) : (
              users.map((chatUser, index) => (
                <div
                  key={index}
                  className="user-item d-flex align-items-center p-2 border-bottom"
                >
                  <span className={`status-badge ${chatUser.status}`}></span>
                  <span className="font-weight-bold">{chatUser.name}</span>
                  {chatUser.status === 'online' && (
                    <span className="badge bg-success ms-auto">
                      <i className="bi bi-circle-fill"></i>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineUserSection;
