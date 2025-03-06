import React from "react";
import "./CustomTextInput.css";

// Sounds
import soundManager from '../logic/soundManager.js';
import click from '../assets/sounds/click.mp3';

const CustomTextInput = ({ value, onChange, placeholder }) => {
  
  soundManager.loadSound('click', click);
  function playClick() {
      soundManager.playSound('click');
  }

  const handleInputChange = (event) => {
    // Allow only numbers and prevent invalid characters
    const newValue = event.target.value.replace(/[^0-9]/g, "");
    onChange(newValue);
    playClick();
  };

  return (
    <input
      type="text"
      className="custom-input"
      value={value}
      onChange={handleInputChange}
      maxLength={4}
      placeholder={placeholder || "Enter number here"}
      onClick={playClick}
    />
  );
};

export default CustomTextInput;