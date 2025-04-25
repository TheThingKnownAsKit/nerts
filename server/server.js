import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import lobbySocket from "./src/sockets/lobbySocket.js";
import gameSocket from "./src/sockets/gameSocket.js";
import { GameManager } from "./src/game/gameManager.js";

// Create an Express application instance and pass in as handler for HTTP server instance
const app = express();
const server = createServer(app);

const gameManager = new GameManager();

// Create Socket.IO server on the provided HTTP server and allow communication from front-end port
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// When a client connects, run this code with their specific socket instance
io.on("connect", (socket) => {
  console.log(`User ${socket.id} connected.`); // Report client connection to server log

  // Log a client disconnecting
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected.`);
  });
});

// Pass the socket server to lobbySocket and gameSocket
lobbySocket(io, gameManager);
gameSocket(io, gameManager);

// Start HTTP server on port 3000 and log
server.listen(3000, () => console.log("Server running on port 3000"));
