export default (io, gameManager) => {
  io.on("connect", (socket) => {
    socket.on("startGame", (lobbyId) => {
      const players = Array.from(io.sockets.adapter.rooms.get(lobbyId));
      const gameState = gameManager.startGame(lobbyId, players);
      io.to(lobbyId).emit("gameStarted", { gameState });
    });
  });
};
// TODO: comment this file, split SocketContext into more socket files

// GENERAL TODO: handle different login errors and add popups, fix pressing enter login bug,
//...
