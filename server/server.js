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
    const lobbyID = Math.random().toString(36).substr(2, 6).toUpperCase();
    socket.join(lobbyID); // This line creates (or joins) the room
    io.to(socket.id).emit("lobbyCreated", { lobbyID });
  });
});
