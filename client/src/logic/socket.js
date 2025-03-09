// Imports
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Create a socket listening on port 3000

// Listen for server creating a lobby and log lobby
socket.on("lobbyCreated", ({ lobbyID }) =>
  console.log(`Lobby ${lobbyID} created.`)
);

// Listen for server adding player to a lobby and log
socket.on("playerJoined", ({ playerID }) =>
  console.log(`New player ${playerID} joined.`)
);

// Helper functions
const createLobby = () => socket.emit("createLobby"); // Tells server to create a lobby
const joinLobby = (lobbyID) => socket.emit("joinLobby", { lobbyID }); // Tells server a client wants to join a given lobby

// Export socket instance and helper functions
export { socket, createLobby, joinLobby };
