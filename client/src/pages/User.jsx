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

        </div>
    );
}

export default User;