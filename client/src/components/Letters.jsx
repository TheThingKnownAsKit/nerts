import React, { useState } from "react";
import "./Letters.css";
import soundManager from "../logic/soundManager.js";
import play from "../assets/sounds/play.mp3";
import nImg from "../assets/images/letters/N.png";
import eImg from "../assets/images/letters/E.png";
import rImg from "../assets/images/letters/R.png";
import tImg from "../assets/images/letters/T.png";
import sImg from "../assets/images/letters/S.png";
import exImg from "../assets/images/letters/!.png";

/**
 * Animated logo for login, signup, and home pages.
 */
const letters = ["N", "E", "R", "T", "S", "!"];
const imageMap = {
  N: nImg,
  E: eImg,
  R: rImg,
  T: tImg,
  S: sImg,
  "!": exImg,
};

const Letters = () => {
  const [clickCounts, setClickCounts] = useState(
    letters.reduce((acc, letter) => ({ ...acc, [letter]: 0 }), {})
  );

  soundManager.loadSound("play", play);
  function playPlay() {
    soundManager.playSound("play");
  }

  const handleClick = (letter) => {
    setClickCounts((prevCounts) => {
      const newCounts = { ...prevCounts, [letter]: prevCounts[letter] + 1 };
      return newCounts;
    });
    playPlay();
  };

  return (
    <div className="wiggle-container">
      {letters.map((letter, index) => {
        const isSecret = clickCounts[letter] >= 5;

        return (
          <img
            key={index}
            src={imageMap[letter]}
            className={`wiggle-letter ${isSecret ? "secret" : ""}`}
            draggable="false"
            onClick={() => handleClick(letter)}
            style={{ animationDelay: `${index * 0.2}s` }} // Offsets each letter
          />
        );
      })}
    </div>
  );
};

export default Letters;
