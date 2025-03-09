import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("lobbyCreated", ({ lobbyID }) =>
  console.log("Lobby Created:", lobbyID)
);
socket.on("playerJoined", ({ playerID }) =>
  console.log("New Player Joined:", playerID)
);

export default socket;
