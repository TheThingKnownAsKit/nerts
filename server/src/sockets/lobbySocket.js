export default (io, gameManager) => {
  io.on("connect", (socket) => {
    // Listen for client requesting to create a lobby
    socket.on("createLobby", ({ userID }) => {
      const lobbyID = gameManager.createLobby(); // Get unique lobby ID
      socket.join(lobbyID); // Add client to a "room" with this lobby ID
      socket.data.userID = userID; // ✅ Fix: associate userID with socket

      // Tell client the lobby has been created and log the lobby creation
      socket.emit("lobbyCreated", { lobbyID });
      console.log(`Player ${userID} created lobby ${lobbyID}.`);
    });

    // Listen for client requesting to join a lobby
    socket.on("joinLobby", ({ lobbyID, userID }) => {
      const room = io.sockets.adapter.rooms.get(lobbyID); // Get requested lobby ID room (undefined if it doesn't exitst)

      // Check if room exists
      if (room) {
        socket.join(lobbyID); // Add client to lobby room
        socket.data.userID = userID; // Store userID on the socket

        // Tell client the lobby has been joined, tell the lobby a new client has joined, and log the join
        socket.emit("lobbyJoined", { lobbyID });
        io.to(lobbyID).emit("playerJoined", {
          playerID: userID,
          message: `Player ${userID} has joined the lobby.`,
        });
        console.log(`Player ${userID} joined lobby ${lobbyID}.`);
      } else {
        socket.emit("lobbyNotFound", {
          message: `Error: lobby ${lobbyID} not found.`,
        }); // Tell client the lobby was not found
      }
    });
  });
};
