import { ChatServer } from "./modules/index.js";

const PORT = 3001;

const chatServer = new ChatServer(PORT);
chatServer.start();