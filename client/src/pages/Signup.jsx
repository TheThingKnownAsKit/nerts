import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import LoginInput from "../components/LoginInput"; 
import "./Signup.css";
import SoundControl from "../components/SoundControl";
import NextButton from "../components/NextButton";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    navigate("/home");
  };

  return (
    <div className="main centered">
      <Letters />
      <div id="login-signup" className="su">
        <h3 className="form-title">Sign Up</h3>

        <form onSubmit={handleSignup} className="signup-form">
          <LoginInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <div className="spacer-1vw"></div>
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <div className="spacer-1vw"></div>
          <LoginInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <div className="spacer-1vw"></div>
          <NextButton onClick={handleSignup}/>
        </form>
      </div>
      <SoundControl />
    </div>
  );
}

export default Signup;
