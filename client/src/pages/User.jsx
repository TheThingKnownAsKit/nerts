import React, { useState } from "react";
import BackButton from '../components/BackButton'
import profile from '../assets/images/user.png';

import './User.css'

function User() {  
    const username = "Username";

    return (
        <div className='main centered'>
            <BackButton/>

            <div className="user-header">
                <img className="user-image no-select" src={profile} alt="Profile picture"/>
                <h3 className="user-name no-select">{username}</h3>
            </div>
            <div className="user-edit">
                <h3 className="change-user-image no-select"><u>Change Icon</u></h3>
                <h3 className="change-user-name no-select"><u>Change Username</u></h3>
            </div>
            <div className="stats">
                <h3 className="games-played">Games Played: 
                    <span className="num-gp">100</span>
                </h3>
                <h3 className="games-won">Games Won: 
                    <span className="num-gw">80</span>
                </h3>
                <h3 className="win-loss">Win/Loss Ratio: 
                    <span className="wl-ratio">0.8</span>
                </h3>
                <h3 className="play-speed">Play Speed: 
                    <span className="ps">1 card/s</span>
                </h3>
            </div>
        </div>
    );
}

export default User;