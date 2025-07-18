import React, { useEffect, useState } from "react";
import { websocket } from "./websocket";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserRegistration from "./UserRegistration";

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  // useEffect(() => {
  //   websocket();
  // }, []);

  return (
    <div className="container-fluid">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserRegistration />} />
          {/* <Route
            path="/chat"
            element={!isSignedIn ? <Navigate to="/" /> : <Chat />}
          /> */}
        </Routes>
      </BrowserRouter>
      {/* <div id="messages"></div>
      <input id="message_input" />
      <button id="send">Send Message</button> */}
    </div>
  );
};

export default App;
