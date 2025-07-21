const { ChatServer } = require("./modules/index");

const PORT = 3001;

const chatServer = new ChatServer(PORT);
chatServer.start();