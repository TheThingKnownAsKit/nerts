import React, { useState } from "react";
import "./SettingsBox.css";
import soundManager from "../logic/soundManager.js";

const SettingsBox = () => {
  //state for color square selected
  const [selectedColor, setSelectedColor] = useState(null);
  //state for sound effect volume 0-100
  const [soundEffectVolume, setSoundEffectVolume] = useState(50);

  //toggles for music, deck hotkey, colorblind palette
  const [music, setMusic] = useState(true);
  const [deckHotkey, setDeckHotkey] = useState(true);
  const [colorblind, setColorblind] = useState(true);

  //color options
  const colors = [
    "#f2002b",
    "#f64021",
    "#f98016",
    "#ffff00",
    "#00cc66",
    "#496ddb",
    "#7209b7",
  ];

  //to update color when selected
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  //to update volume from slider changes
  const handleVolumeChange = (event) => {
    const newVolume = Number(event.target.value);
    setSoundEffectVolume(newVolume);
    //soundManger needs volume between 0.0/1.0
    soundManager.setVolume(newVolume / 100);
  };

  return (
    <div className="settings-box">
      <h3 className="title">SETTINGS</h3>

      {/* label for background color */}
      <div className="settings-item">
        <label>Background Color:</label>
      </div>

      {/* color selection squares */}
      <div className="squares-container">
        {colors.map((color, index) => (
          <div
            key={index}
            //apply selected class if this square matches chosen color
            className={`square ${selectedColor === color ? "selected" : ""}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      {/* volume control slider*/}
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

      {/* toggle button for background music */}
      <div className="settings-item">
        <label>Music:</label>
        <button onClick={() => setMusic(!music)}>{music ? "ON" : "OFF"}</button>
      </div>

      {/* toggle button for tab as deck hotkey */}
      <div className="settings-item">
        <label>Tab for Deck Hotkey:</label>
        <button onClick={() => setDeckHotkey(!deckHotkey)}>
          {deckHotkey ? "ON" : "OFF"}
        </button>
      </div>

      {/* toggly button for colorblind friendly palette */}
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
