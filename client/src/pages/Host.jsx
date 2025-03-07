import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import CustomTextInput from '../components/CustomTextInput.jsx';
import CustomButton from "../components/CustomButton.jsx";

import './Host.css';

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

    const handleInputChange = (event) => {
        // Allow only numbers and prevent invalid characters
        const newValue = event.target.value.replace(/[^0-9]/g, "");
        handleNumberChange(newValue);
    };

    const handlePlayClick = () => {
        navigate('/game');
    };

    return (
        <div className='main centered'>
            <CustomButton back={true} absolute={true} text={"Back"} />

            <h3 className='host no-select'>HOST</h3>
            <CustomButton back={false} absolute={false} text={"Create Game"} onClick={handlePlayClick} />

            <h3 className='join no-select'>JOIN</h3>

            <div className="input-container">
                <CustomTextInput 
                    value={number} 
                    onChange={handleInputChange} 
                    placeholder="Code"
                    center={true}
                    max={4} />
                <CustomButton back={false} absolute={false} text={"Next"} onClick={handleCheckInput} />
            </div>
        </div>
    );
}

export default Host;
