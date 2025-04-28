import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import CustomTextInput from "../components/CustomTextInput.jsx";
import CustomButton from "../components/CustomButton.jsx";
import soundManager from "../logic/soundManager.js";
import backgroundMusic from "../assets/sounds/background.mp3";

import "./Host.css";

function Host() {
  const navigate = useNavigate();
  const [lobbyID, setLobbyID] = useState("");
  const { socket } = useSocket();

  // Starts music back up if refreshed on this page
  if (
    !soundManager.backgroundMusic &&
    localStorage.getItem("isMusicOn") == "true"
  ) {
    soundManager.playBackgroundMusic(backgroundMusic);
  }

  // Handle changes for input
  const handleLobbyIDChange = (newLobbyID) => {
    setLobbyID(newLobbyID);
  };

  const handleCreateLobby = () => {
    if (!socket) return;

    socket.emit("createLobby");
  };

  const handleJoinLobby = () => {
    if (lobbyID) {
      socket.emit("joinLobby", { lobbyID });
    } else {
      console.log("Input is empty.");
    }
  };

  const handleInputChange = (event) => {
    // Allow only alphanumeric inputs to prevent invalid characters
    const newValue = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    handleLobbyIDChange(newValue);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("lobbyCreated", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });

    socket.on("lobbyJoined", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });

    return () => {
      socket.off("lobbyCreated");
      socket.off("lobbyJoined");
    };
  }, []);

  // Join game on enter-press
  let keyPressed = false;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !keyPressed) {
      keyPressed = true;
      if (lobbyID) {
        handleJoinLobby(e);
      }
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      keyPressed = false;
    }
  });

  return (
    <div className="main centered">
      <CustomButton back={true} absolute={true} text={"Back"} />

      <h3 className="host no-select">HOST</h3>
      <CustomButton
        back={false}
        absolute={false}
        text={"Create Lobby"}
        onClick={handleCreateLobby}
      />

      <h3 className="join no-select">JOIN</h3>

      <div className="input-container code-input">
        <CustomTextInput
          value={lobbyID}
          onChange={handleInputChange}
          placeholder="Code"
          center={true}
          max={6}
        />
        <CustomButton
          back={false}
          absolute={false}
          text={"Next"}
          onClick={handleJoinLobby}
        />
      </div>
    </div>
  );
}

export default Host;
