import React, { useState, useEffect } from 'react';
import './SoundControl.css'

import soundManager from '../logic/soundManager';
import sound_on from '../assets/sound_on.png';
import sound_off from '../assets/sound_off.png';
import music_on from '../assets/music_on.png';
import music_off from '../assets/music_off.png';
import backgroundMusic from '../assets/sounds/background.mp3';
import click from '../assets/sounds/click.mp3';

const SoundControl = () => {
  const [isSoundOn, setIsSoundOn] = useState(true);  // Default to sound on
  const [isMusicOn, setIsMusicOn] = useState(true);  // Default to music on

  soundManager.loadSound('click', click);
  function playClick() {
      soundManager.playSound('click');
  }

  // Use effect manages sound and music behavior based on the state
  useEffect(() => {
    if (isSoundOn) {
      soundManager.enableSounds();
    } else {
      soundManager.disableSounds();
    }

    if (isMusicOn) {
      if (!soundManager.backgroundMusic || soundManager.backgroundMusic.paused) {
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
      <div className="sound-toggle" onClick={handleSoundToggle} onMouseEnter={playClick}>
        <img src={isSoundOn ? sound_on : sound_off} alt="Sound toggle" />
      </div>

      <div className="music-toggle" onClick={handleMusicToggle} onMouseEnter={playClick}>
        <img src={isMusicOn ? music_on : music_off} alt="Music toggle" />
      </div>
    </div>
  );
};

export default SoundControl;
