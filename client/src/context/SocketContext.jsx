import { createContext, useState, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null); // Create new context for socket connection

// Create a context provider that "provides" all child components (in our case all of our pages) with socket values
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // Socket values to be provided on use

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
    newSocket.on("lobbyCreated", ({ lobbyID }) =>
      console.log(`Lobby ${lobbyID} created.`)
    );

    newSocket.on("playerJoined", ({ playerID }) =>
      console.log(`New player ${playerID} joined.`)
    );

    newSocket.on("lobbyNotFound", (message) => {
      console.log(message);
    });

    newSocket.on("gameStarted", (gameState) => {
      console.log(gameState);
    });

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
      value={{ socket, initializeSocket, disconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext); // Custom Socket hook to access any value in any child component/page
