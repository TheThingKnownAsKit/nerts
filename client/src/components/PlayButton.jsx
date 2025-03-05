import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomButton.css'

// Sounds
import soundManager from '../logic/soundManager.js';
import click from '../assets/sounds/click.mp3';

const PlayButton = () => {
  const navigate = useNavigate();

  soundManager.loadSound('click', click);
  function playClick() {
      soundManager.playSound('click');
  }

  const handlePlayClick = () => {
    navigate('/game');
  };

  return (
    <button className='btn play no-select' onClick={handlePlayClick} onMouseEnter={playClick}>
      <u>Create Game</u>
    </button>
  );
};

export default PlayButton;
