import React from "react";
import "./LoginInput.css"; 
import soundManager from "../logic/soundManager.js";
import click from "../assets/sounds/click.mp3";

const LoginInput = ({ value, onChange, placeholder, type = "text" }) => {
  soundManager.loadSound("click", click);

  function playClick() {
    soundManager.playSound("click");
  }

  const handleInputChange = (event) => {
    onChange(event.target.value);
    playClick();
  };

  return (
    <input
      type={type}
      className="login-input"
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder || "Enter text here"}
      onClick={playClick}
    />
  );
};

export default LoginInput;
