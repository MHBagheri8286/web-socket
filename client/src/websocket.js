export function websocket() {
  const messages = document.getElementById("messages");
  const input = document.getElementById("message_input");
  const button = document.getElementById("send");

  button.disabled = true;
  button.addEventListener("click", sendMessage, false);

  const url = `ws://localhost:3001/websocket`;
  const server = new WebSocket(url);
  
  server.onopen = function () {
    button.disabled = false;
  };

  server.onmessage = function (event) {
    const { data } = event;
    generateMessageEntry(data, "Server");
  };

  function generateMessageEntry(message, type) {
    const newMessage = document.createElement("div");
    newMessage.innerText = `${type} says: ${message}`;
    messages.appendChild(newMessage);
  }

  function sendMessage() {
    const text = input.value;
    generateMessageEntry(text, "Client");
    server.send(text);
  }
}
