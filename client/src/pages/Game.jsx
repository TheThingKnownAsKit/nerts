import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import CustomTextInput from "../components/CustomTextInput.jsx";
import CustomButton from "../components/CustomButton.jsx";
import Popup from "../components/Popup.jsx"; // ← import your Popup
import soundManager from "../logic/soundManager.js";
import backgroundMusic from "../assets/sounds/background.mp3";

import "./Host.css";

function Host() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [lobbyID, setLobbyID] = useState("");
  const [popup, setPopup] = useState(null); // ← popup state

  // play music on mount
  useEffect(() => {
    if (
      !soundManager.backgroundMusic &&
      localStorage.getItem("isMusicOn") === "true"
    ) {
      soundManager.playBackgroundMusic(backgroundMusic);
    }
  }, []);

  // socket listeners
  useEffect(() => {
    socket.on("lobbyCreated", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });
    socket.on("lobbyJoined", ({ lobbyID }) => {
      navigate(`/game/${lobbyID}`);
    });
    // ← assume your server will emit this when join fails:
    socket.on("lobbyNotFound", () => {
      setPopup({
        title: "Join Error",
        message: "Lobby code not found. Please check your code and try again.",
      });
    });

    return () => {
      socket.off("lobbyCreated");
      socket.off("lobbyJoined");
      socket.off("lobbyNotFound");
    };
  }, [socket, navigate]);

  const handleCreateLobby = () => {
    socket.emit("createLobby");
  };

  const handleJoinLobby = () => {
    if (!lobbyID) {
      // local validation
      setPopup({
        title: "Input Error",
        message: "Please enter a lobby code before joining.",
      });
      return;
    }
    socket.emit("joinLobby", { lobbyID });
  };

  // optional: capture “Enter” key in an effect
  useEffect(() => {
    let keyPressed = false;
    const onKeyDown = (e) => {
      if (e.key === "Enter" && !keyPressed) {
        keyPressed = true;
        handleJoinLobby();
      }
    };
    const onKeyUp = (e) => {
      if (e.key === "Enter") {
        keyPressed = false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [lobbyID]);

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
          onChange={(e) =>
            setLobbyID(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
          }
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

      {/* render the popup when needed */}
      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

export default Host;
