import React, { useState, useEffect } from "react";
import { useRef } from "react";
import "./SettingsBox.css";
import soundManager from "../logic/soundManager.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSocket } from "../context/SocketContext";
import { db } from "../firebase/config";

import blue from "../assets/images/backgrounds/Blue-BG.png";
import green from "../assets/images/backgrounds/Green-BG.png";
import orange from "../assets/images/backgrounds/Orange-BG.png";
import purple from "../assets/images/backgrounds/Purple-BG.png";
import red from "../assets/images/backgrounds/Red-BG.png";
import redOrange from "../assets/images/backgrounds/Red-Orange-BG.png";
import yellow from "../assets/images/backgrounds/Yellow-BG.png";

const bgMap = {
  "#f2002b": red,
  "#f64021": redOrange,
  "#f98016": orange,
  "#ffff00": yellow,
  "#00cc66": green,
  "#496ddb": blue,
  "#7209b7": purple,
};

const SettingsBox = () => {
  const { userID } = useSocket();
  const [settings, setSettings] = useState({
    bgColor: "#00cc66",
    soundEffectVolume: 50,
    deckHotkey: true,
  });
  const [loading, setLoading] = useState(true);
  const didMount = useRef(false);

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!userID) return;

      try {
        const settingsRef = doc(db, "users", userID, "settings", "data");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const savedSettings = settingsSnap.data();
          setSettings(savedSettings);

          document.body.style.backgroundImage = `url(${
            bgMap[savedSettings.bgColor || settings.bgColor]
          })`;
          soundManager.setVolume((savedSettings.soundEffectVolume || 50) / 100);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userID]);

  // Save settings to Firestore and localStorage when they change
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const saveSettings = async () => {
      if (!userID) return;

      try {
        const settingsRef = doc(db, "users", userID, "settings", "data");
        await setDoc(settingsRef, settings, { merge: true });
        localStorage.setItem("bgColor", settings.bgColor);
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    };

    saveSettings();
  }, [settings, userID]);

  const handleColorClick = (color) => {
    const newSettings = { ...settings, bgColor: color };
    setSettings(newSettings);
    document.body.style.backgroundImage = `url(${bgMap[color]})`;
  };

  const handleVolumeChange = (e) => {
    const volume = Number(e.target.value);
    const newSettings = { ...settings, soundEffectVolume: volume };
    setSettings(newSettings);
    soundManager.setVolume(volume / 100);
  };

  const toggleDeckHotkey = () => {
    const newSettings = { ...settings, deckHotkey: !settings.deckHotkey };
    setSettings(newSettings);
  };

  const colors = Object.keys(bgMap);

  if (loading) {
    return <div className="settings-box">Loading settings...</div>;
  }

  return (
    <div className="settings-box">
      <h3 className="title">SETTINGS</h3>

      <div className="settings-item">
        <label>Background Color:</label>
      </div>

      <div className="squares-container">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`square ${settings.bgColor === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      <div className="settings-item">
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.soundEffectVolume}
          onChange={handleVolumeChange}
          className="slider"
        />
        <span className="volume-label">{settings.soundEffectVolume}%</span>
      </div>

      <div className="settings-item">
        <label>Tab for Deck Hotkey:</label>
        <button
          className={`toggle-btn ${settings.deckHotkey ? "active" : ""}`}
          onClick={toggleDeckHotkey}
        >
          {settings.deckHotkey ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
};

export default SettingsBox;
