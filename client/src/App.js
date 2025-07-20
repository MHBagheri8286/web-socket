import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Chat from "./components/chat/Chat";
import Registration from "./components/Registration";

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  return (
    <div className="container-fluid">
        <Routes>
          <Route
            path="/"
            element={
              <Registration
                onRegister={(value) => {
                  setUser(value);
                  navigate('/chat');
                }}
              />
            }
          />
          <Route
            path="/chat"
            element={!user.name ? <Navigate to="/" /> : <Chat user={user}/>}
          />
        </Routes>
    </div>
  );
};

export default () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};
