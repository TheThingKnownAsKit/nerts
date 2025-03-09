import { Server } from "socket.io";

// Create Socket.IO server on the provided HTTP server and allow communication from front-end port
const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // When a client connects, run this code with their specific socket instance
  io.on("connect", (socket) => {
    console.log(`User ${socket.id} connected.`); // Report client connection to server log

    // Listen for client requesting to create a lobby
    socket.on("createLobby", () => {
      const lobbyID = Math.random().toString(36).slice(2, 8).toUpperCase(); // Generate random, 6 character alphanumeric lobby ID
      socket.join(lobbyID); // Add client to a "room" with this lobby ID

      // Tell client the lobby has been created and log the lobby creation
      socket.emit("lobbyCreated", { lobbyID });
      console.log(`Player ${socket.id} created lobby ${lobbyID}.`);
    });

    // Listen for client requesting to join a lobby
    socket.on("joinLobby", ({ lobbyID }) => {
      const room = io.sockets.adapter.rooms.get(lobbyID); // Get requested lobby ID room (undefined if it doesn't exitst)

      // Check if room exists
      if (room) {
        socket.join(lobbyID); // Add client to lobby room

        // Tell client the lobby has been joined, tell the lobby a new client has joined, and log the join
        socket.emit("lobbyJoined", { lobbyID });
        io.to(lobbyID).emit("playerJoined", { playerID: socket.id });
        console.log(`Player ${socket.id} joined lobby ${lobbyID}.`);
      } else {
        socket.emit("error", { message: "Lobby not found." }); // Tell client the lobby was not found
      }
    });

    // Log a client disconnecting
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected.`);
    });
  });

  // Return socket server instance
  return io;
};

export default setupSocketServer;
