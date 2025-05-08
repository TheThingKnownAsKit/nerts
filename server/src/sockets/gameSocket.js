export default (io, gameManager) => {
    io.on("connect", (socket) => {
        // Event listener for starting a game
        socket.on("startGame", (lobbyId) => {
            const socketsInRoom = io.sockets.adapter.rooms.get(lobbyId); // Set of socket IDs
            const players = [];

            for (const socketId of socketsInRoom) {
                const playerSocket = io.sockets.sockets.get(socketId);
                if (playerSocket?.data?.userID) {
                    players.push(playerSocket.data.userID);
                }
            }

            if (players.length > 4 || players.length < 1) return; // Not enough players to start the game)

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
      lobbyId: "ABCDEF"
    } */
        socket.on("cardPlayed", (payload) => {
            const gameState = gameManager.games[payload.lobbyId];
            const moveWasMade = gameState.playCard(payload, gameManager);

            socket.emit("cardPlayAccepted", moveWasMade);

            if (moveWasMade) {
                io.to(payload.lobbyId).emit("gameStateUpdated", {
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
            const safeState = JSON.parse(JSON.stringify(gameManager.games[payload.lobbyId]));
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
            const endRound = gameState.callNerts(payload.playerId); // Attempt to call nerts

            // Check if round has ended
            if (endRound) {
                io.to(payload.lobbyId).emit("endRound"); // Broadcast that round has ended
                const players = gameState.getPlayers(); // Get array of all player objects

                // Check if someone is above 100 points at end of round
                const scoreAboveThreshold = players.some((player) => player.score >= 100);

                // Broadcast that game has ended if a player won and send scores
                if (scoreAboveThreshold) {
                    io.to(payload.lobbyId).emit("endGame", { players });
                }
            }
        });

        // Event listener for starting another round
        socket.on("startRound", (lobbyId) => {
            const gameState = gameManager.games[lobbyId];
            gameState.startRound();

            // Trigger refresh manually because the flip function only modifies a primitive type
            const safeState = JSON.parse(JSON.stringify(gameManager.games[lobbyId]));
            io.to(lobbyId).emit("gameStateUpdated", { gameState: safeState });

            io.to(lobbyId).emit("roundStarted");
        });
    });
};
