export default (io, gameManager) => {
  const lobbies = {};

  io.on("connect", (socket) => {
    // Listen for client requesting to create a lobby
    socket.on("createLobby", async ({ userID }) => {
      const lobbyID = gameManager.createLobby(); // Get unique lobby ID
      socket.join(lobbyID); // Add client to a "room" with this lobby ID
      socket.data.userID = userID; // ✅ Fix: associate userID with socket

      lobbies[lobbyID] = userID;

      // Tell client the lobby has been created and log the lobby creation
      socket.emit("lobbyCreated", { lobbyID, host: userID });
      console.log(`Player ${userID} created lobby ${lobbyID}.`);

      const players = await getUserIDsInLobby(io, lobbyID);
      io.to(lobbyID).emit("lobbyUpdated", { players });
    });

    // Listen for client requesting to join a lobby
    socket.on("joinLobby", async ({ lobbyID, userID }) => {
      const room = io.sockets.adapter.rooms.get(lobbyID); // Get requested lobby ID room (undefined if it doesn't exitst)

      // Check if room exists
      if (room) {
        socket.join(lobbyID); // Add client to lobby room
        socket.data.userID = userID; // Store userID on the socket

        // Tell client the lobby has been joined, tell the lobby a new client has joined, and log the join
        const host = lobbies[lobbyID];
        socket.emit("lobbyJoined", { lobbyID, host });
        socket.broadcast.to(lobbyID).emit("playerJoined", {
          playerID: userID,
          message: `Player ${userID} has joined the lobby.`,
        });
        console.log(`Player ${userID} joined lobby ${lobbyID}.`);

        // ✅ Get current list of userIDs in lobby
        const players = await getUserIDsInLobby(io, lobbyID);
        io.to(lobbyID).emit("lobbyUpdated", { players });
      } else {
        socket.emit("lobbyNotFound", {
          message: `Error: lobby ${lobbyID} not found.`,
        }); // Tell client the lobby was not found
      }
    });

    // Handles a player leaving a lobby
    /* EXAMPLE PAYLOAD
        {
            userID: "FJDKfjdksf837_fjkd",
            lobbyID: "ABCDEF"
        }
        */
    socket.on("leftLobby", (payload) => {
      console.log(`User ${payload.userID} is leaving lobby ${payload.lobbyID}`);
      socket.leave(payload.lobbyID);
      if (!io.sockets.adapter.rooms.get(payload.lobbyID)) {
        delete gameManager.games[payload.lobbyID];
      }
    });

    const getUserIDsInLobby = async (io, lobbyID) => {
      const sockets = await io.in(lobbyID).fetchSockets();
      return sockets.map((s) => s.data.userID);
    };
  });
};
