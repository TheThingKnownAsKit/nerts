import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Settings() {
  const navigate = useNavigate();

  // Local state for each toggle
  const [soundEffects, setSoundEffects] = useState(true);
  const [music, setMusic] = useState(true);
  const [deckHotkey, setDeckHotkey] = useState(true);
  const [colorblind, setColorblind] = useState(true);

  // Example color options
  const colorOptions = [
    '#FF0000', '#FF7F00', '#FFFF00',
    '#00FF00', '#0000FF', '#4B0082',
    '#FF69B4'
  ];

  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">SETTINGS</h1>

        {/* Color Options (the row of colored squares) */}
        <div className="color-options">
          {colorOptions.map((color, index) => (
            <div
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => console.log(`Selected color: ${color}`)}
            />
          ))}
        </div>

        {/* Sound Effects ON/OFF */}
        <div className="settings-item">
          <label>Sound Effects:</label>
          <button onClick={() => setSoundEffects(!soundEffects)}>
            {soundEffects ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Music ON/OFF */}
        <div className="settings-item">
          <label>Music:</label>
          <button onClick={() => setMusic(!music)}>
            {music ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Deck Hotkey (Tab) ON/OFF */}
        <div className="settings-item">
          <label>Tab for Deck Hotkey:</label>
          <button onClick={() => setDeckHotkey(!deckHotkey)}>
            {deckHotkey ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Colorblind Palette ON/OFF */}
        <div className="settings-item">
          <label>Colorblind Palette:</label>
          <button onClick={() => setColorblind(!colorblind)}>
            {colorblind ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Back Button */}
        <div className="back-button-container">
          <button onClick={handleBack}>BACK</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
