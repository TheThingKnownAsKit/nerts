import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket, createLobby, joinLobby } from "../logic/socket";
import CustomTextInput from "../components/CustomTextInput.jsx";
import CustomButton from "../components/CustomButton.jsx";

import "./Host.css";

function Host() {
  const navigate = useNavigate();
  const [lobbyID, setLobbyID] = useState("");

  // Handle changes for input
  const handleLobbyIDChange = (newLobbyID) => {
    setLobbyID(newLobbyID);
  };

  const handleCreateLobby = () => {
    createLobby();
  };

  const handleJoinLobby = () => {
    if (lobbyID) {
      joinLobby(lobbyID);
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

      <div className="input-container">
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
