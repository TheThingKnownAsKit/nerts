import React, { useState } from 'react';
import './SettingsBox.css';

const SettingsBox = () => {  
  const [selectedColor, setSelectedColor] = useState(null);
  const [soundEffects, setSoundEffects] = useState(true);
  const [music, setMusic] = useState(true);
  const [deckHotkey, setDeckHotkey] = useState(true);
  const [colorblind, setColorblind] = useState(true);
  const colors = ['#f2002b', '#f64021', '#f98016', '#ffff00', '#00cc66', '#496ddb', '#7209b7'];
  
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };
  
  return (
    <div className="settings-box">
      <h3 className="title">SETTINGS</h3>
      <div className="squares-container">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`square ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      <div className="settings-item">
        <label>Sound Effects:</label>
        <button onClick={() => setSoundEffects(!soundEffects)}>
          {soundEffects ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="settings-item">
        <label>Music:</label>
        <button onClick={() => setMusic(!music)}>
          {music ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="settings-item">
        <label>Tab for Deck Hotkey:</label>
        <button onClick={() => setDeckHotkey(!deckHotkey)}>
          {deckHotkey ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="settings-item">
        <label>Colorblind Palette:</label>
        <button onClick={() => setColorblind(!colorblind)}>
          {colorblind ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

export default SettingsBox;
