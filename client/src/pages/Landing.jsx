import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import LoginInput from "../components/LoginInput"; 

import "./Landing.css";
import SoundControl from "../components/SoundControl";
import NextButton from "../components/NextButton.jsx";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      navigate("/home");
    } else {
      alert("Please fill out both username and password.");
    }
  };

  return (
    <div className="main centered">
      <Letters />
      <div id="login-signup">
        <h3 className="form-title-landing">Login</h3>
        <form onSubmit={handleLogin} className="login-form">
          <LoginInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          
          <div className="spacer-1vw"></div>

          <div className="password-row">
            <LoginInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />
             <NextButton onClick={handleLogin}/>
          </div>
        </form>
        <div className="signup-link">
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </div>
      <SoundControl />
    </div>
  );
}

export default Landing;

