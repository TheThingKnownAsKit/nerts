import React from "react";
import "./CustomTextInput.css";

// Sounds
import soundManager from "../logic/soundManager.js";
import click from "../assets/sounds/click.mp3";

const CustomTextInput = ({
  value,
  onChange,
  placeholder,
  center,
  type = "text",
  max,
}) => {
  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  function change(event) {
    playClick();
    onChange(event);
  }

  return (
    <input
      type={type}
      className={`custom-input ${center ? "center" : ""}`}
      value={value}
      onChange={change}
      maxLength={max}
      placeholder={placeholder || "Enter number here"}
      onClick={playClick}
    />
  );
};

export default CustomTextInput;
