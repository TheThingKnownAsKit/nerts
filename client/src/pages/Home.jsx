import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Letters from "../components/Letters";
import UserBox from "../components/UserBox";
import "./Home.css";
import { useSocket } from "../context/SocketContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Sounds
import soundManager from "../logic/soundManager.js";
import backgroundMusic from "../assets/sounds/background.mp3";
import click from "../assets/sounds/click.mp3";
import SoundControl from "../components/SoundControl.jsx";

function Home() {
  const navigate = useNavigate();
  const { userID } = useSocket();
  const [settingsLoaded, setSettingsLoaded] = React.useState(false);

  soundManager.loadSound("click", click);
  if (
    !soundManager.backgroundMusic &&
    localStorage.getItem("isMusicOn") == "true"
  ) {
    soundManager.playBackgroundMusic(backgroundMusic);
  }
  function playClick() {
    soundManager.playSound("click");
  }

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!userID) return;

      try {
        const settingsRef = doc(db, "users", userID, "settings", "data");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const { bgColor, deckHotkey } = settingsSnap.data();

          // Apply background color
          if (bgColor) {
            document.documentElement.style.setProperty("--bg-color", bgColor);
          }

          // Store deck hotkey setting globally
          window.deckHotkeyEnabled = deckHotkey !== false; // default to true if not set
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setSettingsLoaded(true);
      }
    };

    loadSettings();
  }, [userID]);

  if (!settingsLoaded) {
    return <div className="main centered">Loading...</div>;
  }

  return (
    <div className="main centered">
      <Letters />
      <h1
        onClick={() => navigate("/host")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/host");
          }
        }}
      >
        PLAY
      </h1>
      <h2
        onClick={() => navigate("/rules")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/rules");
          }
        }}
      >
        RULES
      </h2>
      <h2
        onClick={() => navigate("/settings")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/settings");
          }
        }}
      >
        SETTINGS
      </h2>
      <UserBox />
      <SoundControl />
    </div>
  );
}

export default Home;
