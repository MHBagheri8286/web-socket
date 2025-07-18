import React from "react";
import { useEffect } from "react";
import { websocket } from "./websocket";

const App = () => {

  useEffect(() => {
    websocket();
  }, []);

  return (
    <div>
      <div id="messages"></div>
      <input id="message_input" />
      <button id="send">Send Message</button>
    </div>
  );
};

export default App;
