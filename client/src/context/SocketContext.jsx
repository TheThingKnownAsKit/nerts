import { createContext, useState, useContext } from "react";
import { io } from "socket.io-client";
import { lobbyEvents } from "../logic/lobbyEvents.js";
import { gameEvents } from "../logic/gameEvents.js";

const SocketContext = createContext(null); // Create new context for socket connection

// Create a context provider that "provides" all child components (in our case all of our pages) with socket values
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // Socket values to be provided on use
  const [gameState, setGameState] = useState(null); // Store the gamestate for global use

  // Starts socket once a user has logged in and gets userID from Firebase Authenticate
  const initializeSocket = () => {
    // Disconnect any existing socket if this function is called
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log(`User ${newSocket.id} is logged in and connected.`); // Log after socket has connected
    });

    // Event listeners
    lobbyEvents(newSocket);
    gameEvents(newSocket);

    setSocket(newSocket); // Set socket object to the initialized socket

    return newSocket;
  };

  // Disconnects the client socket
  const disconnectSocket = () => {
    if (socket) {
      console.log("Disconnecting socket");
      socket.disconnect();
      setSocket(null);
    }
  };

  // Return provider values that can be used by children wrapped within SocketContext
  return (
    <SocketContext.Provider
      value={{ socket, initializeSocket, disconnectSocket, gameState }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); // Custom Socket hook to access any value in any child component/page
