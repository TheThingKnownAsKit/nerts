import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Previous page
  };

  return (
    <button className='back' onClick={handleBackClick}>
      <u>BACK</u>
    </button>
  );
};

export default BackButton;
