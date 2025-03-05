import React, { useState } from 'react';
import './SettingsBox.css';

const SettingsBox = () => {  
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = ['#f2002b', '#f64021', '#f98016', '#ffff00', '#00cc66', '#496ddb', '#7209b7'];
  
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };
  
  return (
    <div className="settings-box">
      <h3 className="title">Settings</h3>
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
    </div>
  );
};

export default SettingsBox;
