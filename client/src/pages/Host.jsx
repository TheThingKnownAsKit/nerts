import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../logic/socket";
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

  const handleJoinLobby = () => {
    if (lobbyID) {
      console.log(lobbyID);
      socket.emit("joinLobby", { lobbyID });
    } else {
      console.log("Input is empty.");
    }
  };

  const handleInputChange = (event) => {
    // Allow only numbers and prevent invalid characters
    const newValue = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
    handleLobbyIDChange(newValue);
  };

  const handleCreateLobby = () => {
    socket.emit("createLobby");
  };

  useEffect(() => {
    socket.on("lobbyCreated", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });

    return () => {
      socket.off("lobbyCreated");
    };
  }, []);

  useEffect(() => {
    socket.on("lobbyJoined", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });

    return () => {
      socket.off("lobbyCreated");
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
        text={"Create Game"}
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
