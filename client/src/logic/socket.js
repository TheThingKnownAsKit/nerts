// Imports
import { io } from "socket.io-client";

// Create a socket listening on port 3000 and send userID for this socket to backend
const socket = io("http://localhost:3000", {
  auth: { userID: sessionStorage.getItem("userID") },
});

socket.userID = sessionStorage.getItem("userID");

// Listen for server creating a lobby and log lobby
socket.on("lobbyCreated", ({ lobbyID }) =>
  console.log(`Lobby ${lobbyID} created.`)
);

// Listen for server adding player to a lobby and log
socket.on("playerJoined", ({ playerID }) =>
  console.log(`New player ${playerID} joined.`)
);

socket.on("lobbyNotFound", (message) => {
  console.log(message);
});

// Helper functions
const createLobby = () => socket.emit("createLobby"); // Tells server to create a lobby
const joinLobby = (lobbyID) => socket.emit("joinLobby", { lobbyID }); // Tells server a client wants to join a given lobby

// Export socket instance and helper functions
export { socket, createLobby, joinLobby };
