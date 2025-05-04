export default (io, gameManager) => {
  io.on("connect", (socket) => {
    // Event listener for starting a game
    socket.on("startGame", (lobbyId, playerCount) => {
      const socketsInRoom = io.sockets.adapter.rooms.get(lobbyId); // Set of socket IDs
      const players = [];

      for (const socketId of socketsInRoom) {
        const playerSocket = io.sockets.sockets.get(socketId);
        if (playerSocket?.data?.userID) {
          players.push(playerSocket.data.userID);
        }
      }

      if (players.length < playerCount && players.length != 1) return; // Not enough players to start the game)

      const gameState = gameManager.startGame(lobbyId, players); // Now using userIDs
      io.to(lobbyId).emit("gameStarted", { gameState });
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
      const gameState = gameManager.games[payload.gameId];
      const moveWasMade = gameState.playCard(payload);

      socket.emit("cardPlayAccepted", moveWasMade);

      if (moveWasMade) {
        io.to(payload.gameId).emit("gameStateUpdated", {
          gameState,
        });
      }
    });

    // Event listener for flipping the draw pile
    /* EXAMPLE PAYLOAD
    {
      lobbyId: "ABCDEF",
      playerId: "XTywdu5KJNsrKqTcAAAB"
    } */
    socket.on("flipDrawPile", (payload) => {
      let gameState = gameManager.games[payload.lobbyId]; // Get game state of specified lobby
      const card = gameState.flipDrawPile(payload.playerId); // Get new "visible" draw pile card
      const playerId = payload.playerId; // Get player ID

      socket.emit("newDrawCard", { card, playerId }); // Send this updated card
      io.to(payload.lobbyId).emit("newDrawCard", {
        card,
        playerId,
      });
      // Trigger refresh manually because the flip function only modifies a primitive type
      const safeState = JSON.parse(
        JSON.stringify(gameManager.games[payload.lobbyId])
      );
      io.to(payload.lobbyId).emit("gameStateUpdated", { gameState: safeState });
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
