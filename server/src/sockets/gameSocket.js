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

// GENERAL TODO:
// Fix login bug: pressing enter to log in pops up with a bunch of login attempts and errors
// Pop ups: login errors, lobby not found, player joined lobby, etc
// Backend logic: handle player leaving, handle invalid move, comment code, connect gameSocket to gameManager logic
// Connecting front end to back end: The back end
