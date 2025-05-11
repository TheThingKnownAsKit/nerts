import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";

import CustomTextInput from "../components/CustomTextInput.jsx";
import CustomButton from "../components/CustomButton.jsx";
import Popup from "../components/Popup.jsx";
import soundManager from "../logic/soundManager.js";
import backgroundMusic from "../assets/sounds/background.mp3";

import "./Host.css";

function Host() {
  const navigate = useNavigate();
  const { socket, userID, setHost } = useSocket();

  const [lobbyID, setLobbyID] = useState("");
  const [popup, setPopup] = useState(null);

  // Starts music back up if refreshed on this page
  useEffect(() => {
    if (
      !soundManager.backgroundMusic &&
      localStorage.getItem("isMusicOn") === "true"
    ) {
      soundManager.playBackgroundMusic(backgroundMusic);
    }
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("lobbyCreated", ({ lobbyID, host }) => {
      setHost(host);
      navigate(`/game/${lobbyID}`);
    });

    socket.on("lobbyJoined", ({ lobbyID, host }) => {
      setHost(host);
      navigate(`/game/${lobbyID}`);
    });

    socket.on("lobbyNotFound", ({ message }) => {
      setPopup({
        title: "Join Error",
        message,
      });
    });

    return () => {
      socket.off("lobbyCreated");
      socket.off("lobbyJoined");
      socket.off("lobbyNotFound");
    };
  }, [socket, navigate]);

  // Input handlers
  const handleLobbyIDChange = (newLobbyID) => {
    setLobbyID(newLobbyID);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
    handleLobbyIDChange(newValue);
  };

  // Lobby actions
  const handleCreateLobby = () => {
    socket.emit("createLobby", { userID });
  };

  const handleJoinLobby = () => {
    // show popup if user tries to join without entering a code
    if (!lobbyID) {
      setPopup({
        title: "Input Error",
        message: "Please enter a lobby code.",
      });
      return;
    }
    socket.emit("joinLobby", { lobbyID, userID });
  };

  // Join on Enter key
  let keyPressed = false;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !keyPressed) {
      keyPressed = true;
      if (lobbyID) {
        handleJoinLobby();
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

      {/*renders popup component
        - passes `title` and `message` from the error event
        - onClose hides the popup and sets to null
      */}
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
