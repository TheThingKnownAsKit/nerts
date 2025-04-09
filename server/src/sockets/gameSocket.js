export default (io, gameManager) => {
  io.on("connect", (socket) => {
    // When a client wants to start a game, initialize a game instance
    socket.on("startGame", (lobbyId) => {
      const players = Array.from(io.sockets.adapter.rooms.get(lobbyId)); // Get all players in lobby
      const gameState = gameManager.startGame(lobbyId, players); // Create a game state
      io.to(lobbyId).emit("gameStarted", { gameState }); // Tell clients game started
    });
  });
};

// GENERAL TODO: fix pressing enter login bug
// POP UPS: login errors, lobby not found, etc
