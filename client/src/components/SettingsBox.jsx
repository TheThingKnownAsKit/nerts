import React, { useState } from "react";
import "./SettingsBox.css";
import soundManager from "../logic/soundManager.js";

const SettingsBox = () => {
  const [selectedColor, setSelectedColor] = useState(null);

  const [soundEffectVolume, setSoundEffectVolume] = useState(50);
  const [music, setMusic] = useState(true);
  const [deckHotkey, setDeckHotkey] = useState(true);
  const [colorblind, setColorblind] = useState(true);

  const colors = [
    "#f2002b",
    "#f64021",
    "#f98016",
    "#ffff00",
    "#00cc66",
    "#496ddb",
    "#7209b7",
  ];

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setSoundEffectVolume(newVolume);
    soundManager.setVolume(newVolume / 100);
  };

  return (
    <div className="settings-box">
      <h3 className="title">SETTINGS</h3>

      {/* Color squares */}
      <div className="squares-container">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`square ${selectedColor === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      {/* Volume Slider*/}
      <div className="settings-item">
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="100"
          value={soundEffectVolume}
          onChange={handleVolumeChange}
          className="slider"
        />
        <span className="volume-label">{soundEffectVolume}%</span>
      </div>

      {/* Music ON/OFF */}
      <div className="settings-item">
        <label>Music:</label>
        <button onClick={() => setMusic(!music)}>{music ? "ON" : "OFF"}</button>
      </div>

      {/* Tab for Deck Hotkey ON/OFF */}
      <div className="settings-item">
        <label>Tab for Deck Hotkey:</label>
        <button onClick={() => setDeckHotkey(!deckHotkey)}>
          {deckHotkey ? "ON" : "OFF"}
        </button>
      </div>

      {/* Colorblind Palette ON/OFF */}
      <div className="settings-item">
        <label>Colorblind Palette:</label>
        <button onClick={() => setColorblind(!colorblind)}>
          {colorblind ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
};

export default SettingsBox;
