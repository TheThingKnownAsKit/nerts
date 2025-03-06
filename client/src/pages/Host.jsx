import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from '../components/BackButton'
import PlayButton from '../components/PlayButton'
import CustomTextInput from '../components/CustomTextInput.jsx'

import './Host.css'

// Sounds
import soundManager from '../logic/soundManager.js';
import click from '../assets/sounds/click.mp3';

function Host() {
    const navigate = useNavigate();
    const [number, setNumber] = useState("");
  
    soundManager.loadSound('click', click);
    function playClick() {
        soundManager.playSound('click');
    }

    // Handle changes for input
    const handleNumberChange = (newNumber) => {
        setNumber(newNumber);
    };

    const handleCheckInput = () => {
        if (number) {
            console.log("Input valid: ", number);
            navigate('/game');
        } else {
            console.log("Input is empty.");
        }
    };

    return (
        <div className='main centered'>
            <BackButton/>

            <h3 className='host no-select'>HOST</h3>
            <PlayButton/>

            <h3 className='join no-select'>JOIN</h3>

            <div className="input-container">
                <CustomTextInput 
                    value={number} 
                    onChange={handleNumberChange} 
                    placeholder="Code"/>
                <div className="check-box" onClick={handleCheckInput} onMouseEnter={playClick}>✔</div>
            </div>
        </div>
    );
}

export default Host;