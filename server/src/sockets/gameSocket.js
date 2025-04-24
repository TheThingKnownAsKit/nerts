export default (io, gameManager) => {
  io.on("connect", (socket) => {
    // Event listener for starting a game
    socket.on("startGame", (lobbyId) => {
      const players = Array.from(io.sockets.adapter.rooms.get(lobbyId)); // Get all players in lobby
      const gameState = gameManager.startGame(lobbyId, players); // Create a game state
      io.to(lobbyId).emit("gameStarted", gameState); // Tell clients game started
    });

    // Event listener for playing a card
    /* EXAMPLE PAYLOAD
    {
      source: {
        card: {
          suit: "hearts",
          rank: 3
        }
      },
      destination: {
        pile: {
          name: "buildPile",
          index: 2
        }
      },
      playerId: "XTywdu5KJNsrKqTcAAAB",
      gameId: "ABCDEF"
    } */
    socket.on("cardPlayed", (payload) => {
      const gameState = gameManager.games[payload.lobbyId]; // Get game state of specified lobby
      const moveWasMade = gameState.playCard(payload); // Try to make the move
      socket.emit("cardPlayAccepted", moveWasMade); // Send move status
    });

    // Event listener for flipping the draw pile
    /* EXAMPLE PAYLOAD
    {
      lobbyId: "ABCDEF",
      playerId: "XTywdu5KJNsrKqTcAAAB"
    } */
    socket.on("flipDrawPile", (payload) => {
      const gameState = gameManager.games[payload.lobbyId]; // Get game state of specified lobby
      const card = gameState.flipDrawPile(payload.playerId); // Get new "visible" draw pile card
      socket.emit("newDrawCard", card); // Send this updated card
    });

    // Event listener for calling nerts
    /* EXAMPLE PAYLOAD
    {
      lobbyId: "ABCDEF",
      playerId: "XTywdu5KJNsrKqTcAAAB"
    } */
    socket.on("callNerts", (payload) => {
      const gameState = gameManager.games[payload.lobbyId]; // Get game state of specified lobby
      const endGame = gameState.callNerts(payload.playerId); // Attempt to call nerts
      socket.emit("endGame", endGame); // Send if nerts was successfully called
    });
  });
};
