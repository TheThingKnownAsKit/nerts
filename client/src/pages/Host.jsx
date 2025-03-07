import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BackButton from '../components/BackButton'
import PlayButton from '../components/PlayButton'
import CustomTextInput from '../components/CustomTextInput.jsx'
import NextButton from "../components/NextButton.jsx";

import './Host.css'

function Host() {
    const navigate = useNavigate();
    const [number, setNumber] = useState("");

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
                <NextButton onClick={handleCheckInput}/>
            </div>
        </div>
    );
}

export default Host;