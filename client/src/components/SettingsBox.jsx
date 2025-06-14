import React, { useState, useEffect } from "react";
import { useRef } from "react";
import "./SettingsBox.css";
import soundManager from "../logic/soundManager.js";

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

/**
 * SettingsBox component allows the user to customize: background color, sound effects volume, ackground music toggle.
 */
const SettingsBox = () => {
  const defaultColor = localStorage.getItem("bgColor") || "#00cc66";
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  //state for sound effect volume 0-100
  const [soundEffectVolume, setSoundEffectVolume] = useState(50);

  //toggles for music, deck hotkey, colorblind palette
  const [music, setMusic] = useState(true);

  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    document.body.style.backgroundImage = `url(${bgMap[selectedColor]})`;
    localStorage.setItem("bgColor", selectedColor);
  }, [selectedColor]);

  const colors = Object.keys(bgMap);

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    setSoundEffectVolume(v);
    soundManager.setVolume(v / 100);
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
    </div>
  );
};

export default SettingsBox;
