const express = require("express");

const app = express();

const expressServer = app.listen(3000);
const socketio = require("socket.io");

const io = socketio(expressServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  socket.on("createLobby", () => {
    const lobbyID = Math.random().toString(36).slice(2, 8).toUpperCase();
    socket.join(lobbyID); // This line creates (or joins) the room
    io.to(socket.id).emit("lobbyCreated", { lobbyID });
  });

  socket.on("joinLobby", ({ lobbyID }) => {
    try {
      socket.join(lobbyID); // Join the lobby room
      io.to(socket.id).emit("lobbyJoined", { lobbyID });
      io.to(lobbyID).emit("playerJoined", { playerID: socket.id }); // Notify others in the lobby
    } catch {
      io.to(socket.id).emit("error", { message: "Lobby not found." }); // Send error if lobby doesn't exist
    }
  });
});
