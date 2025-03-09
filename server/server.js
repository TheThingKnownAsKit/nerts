// Imports
import express from "express";
import { createServer } from "http";
import setupSocketServer from "./src/sockets/socket.js";

// Create an Express application instance and pass in as handler for HTTP server instance
const app = express();
const server = createServer(app);

setupSocketServer(server);

// Start HTTP server on port 3000 and log
server.listen(3000, () => console.log("Server running on port 3000"));
