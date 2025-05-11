import React, { useState, useEffect } from "react";
import "./SoundControl.css";

import soundManager from "../logic/soundManager";
import sound_on from "../assets/images/sound_on.png";
import sound_off from "../assets/images/sound_off.png";
import music_on from "../assets/images/music_on.png";
import music_off from "../assets/images/music_off.png";
import backgroundMusic from "../assets/sounds/background.mp3";
import click from "../assets/sounds/click.mp3";

/**
 * SoundControl component provides toggles sound effects and background music.
 */
const SoundControl = () => {
  const [isSoundOn, setIsSoundOn] = useState(
    JSON.parse(localStorage.getItem("isSoundOn")) ?? true
  );
  const [isMusicOn, setIsMusicOn] = useState(
    JSON.parse(localStorage.getItem("isMusicOn")) ?? true
  );

  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  // Use effect manages sound and music behavior based on the state
  useEffect(() => {
    localStorage.setItem("isSoundOn", JSON.stringify(isSoundOn));
    localStorage.setItem("isMusicOn", JSON.stringify(isMusicOn));

    if (isSoundOn) {
      soundManager.enableSounds();
    } else {
      soundManager.disableSounds();
    }

    if (isMusicOn) {
      if (
        !soundManager.backgroundMusic ||
        soundManager.backgroundMusic.paused
      ) {
        soundManager.playBackgroundMusic(backgroundMusic);
      }
    } else {
      soundManager.stopBackgroundMusic();
    }
  }, [isSoundOn, isMusicOn]);

  const handleSoundToggle = () => {
    setIsSoundOn((prev) => !prev);
  };

  const handleMusicToggle = () => {
    setIsMusicOn((prev) => !prev);
  };

  return (
    <div className="sound-control">
      <div
        className="sound-toggle"
        onClick={handleSoundToggle}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleSoundToggle();
          }
        }}
      >
        <img src={isSoundOn ? sound_on : sound_off} alt="Sound toggle" />
      </div>

      <div
        className="music-toggle"
        onClick={handleMusicToggle}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleMusicToggle();
          }
        }}
      >
        <img src={isMusicOn ? music_on : music_off} alt="Music toggle" />
      </div>
    </div>
  );
};

export default SoundControl;
