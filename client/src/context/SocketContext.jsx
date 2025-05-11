import { createContext, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { lobbyEvents } from "../logic/lobbyEvents.js";
import { gameEvents } from "../logic/gameEvents.js";

const SocketContext = createContext(null); // Create new context for socket connection

// Get the proper server URL (hosted vs local)
const getSocketServerURL = () => {
  // If run on something not from localhost, return that URL
  if (window.location.hostname != "localhost") {
    return window.location.origin;
  }
  return "http://localhost:3000"; // Otherwise default to local port 3000
};

// Create a context provider that "provides" all child components (in our case all of our pages) with socket values
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // Socket values to be provided on use
  const [gameState, setGameState] = useState(null); // Store the gamestate for global use
  const [userID, setUserID] = useState(null);
  const [host, setHost] = useState(null);

  // Starts socket once a user has logged in and gets userID from Firebase Authenticate
  const initializeSocket = (uid) => {
    // Disconnect any existing socket if this function is called
    if (socket) {
      disconnectSocket();
    }

    // Find the backend socket server to connect to and create socket connection
    const socketURL = getSocketServerURL();
    const newSocket = io(socketURL);
    console.log(`SocketContext connected to ${socketURL}`);

    newSocket.on("connect", () => {
      console.log(`User ${uid} is logged in and connected.`); // Log after socket has connected
    });

    // Event listeners
    lobbyEvents(newSocket);
    gameEvents(newSocket, setGameState);

    setSocket(newSocket); // Set socket object to the initialized socket
    setUserID(uid);

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

  useEffect(() => {
    if (!socket) return;

    const handleGameStateUpdate = (gameState) => {
      setGameState(gameState);
      //console.log("Game state updated:", gameState, userID);
    };

    socket.on("gameStateUpdated", handleGameStateUpdate);

    return () => {
      socket.off("gameStateUpdated", handleGameStateUpdate);
    };
  }, [socket]);

  // Return provider values that can be used by children wrapped within SocketContext
  return (
    <SocketContext.Provider
      value={{
        socket,
        initializeSocket,
        disconnectSocket,
        gameState,
        userID,
        host,
        setHost,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); // Custom Socket hook to access any value in any child component/page
