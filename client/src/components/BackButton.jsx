import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomButton.css'

// Sounds
import soundManager from '../logic/soundManager.js';
import click from '../assets/sounds/click.mp3';

const BackButton = () => {
  const navigate = useNavigate();

  soundManager.loadSound('click', click);
  function playClick() {
      soundManager.playSound('click');
  }

  const handleBackClick = () => {
    navigate(-1); // Previous page
  };

  return (
    <button className='btn back no-select' onClick={handleBackClick} onMouseEnter={playClick}>
      <u>BACK</u>
    </button>
  );
};

export default BackButton;
