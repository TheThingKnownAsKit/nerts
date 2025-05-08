import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import lobbySocket from "./src/sockets/lobbySocket.js";
import gameSocket from "./src/sockets/gameSocket.js";
import { GameManager } from "./src/game/gameManager.js";

// Get filepath and directory of server.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an Express application instance and pass in as handler for HTTP server instance
const app = express();
const server = createServer(app);

const port = process.env.PORT || 3000; // Get port being run on or default to 3000

// Create Socket.IO server on the provided HTTP server and allow communication from front-end port
const io = new Server(server, {
    cors: {
        origin: ["https://nerts-web-app.onrender.com", "http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

// When a client connects, run this code with their specific socket instance
io.on("connect", (socket) => {
    console.log(`User ${socket.id} connected.`); // Report client connection to server log

    // Log a client disconnecting
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected.`);
    });
});

const gameManager = new GameManager(io); // Initialize game manager

// Pass the socket server to lobbySocket and gameSocket
lobbySocket(io, gameManager);
gameSocket(io, gameManager);

// Check if dist folder exists
if (fs.existsSync(path.join(__dirname, "dist"))) {
    app.use(express.static(path.join(__dirname, "dist"))); // Serve static front-end compiled files

    // For any requests not found in compiled static files, revert to index.html
    app.get("*", (request, response) => {
        response.sendFile(path.join(__dirname, "dist", "index.html"));
    });
}

// Start HTTP server on port 3000 and log
server.listen(port, () => console.log(`Server running on port ${port}`));
