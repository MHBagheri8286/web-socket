const  ChatServer  = require("./modules/ChatServer");

const PORT = 3001;

const chatServer = new ChatServer(PORT);
chatServer.start();