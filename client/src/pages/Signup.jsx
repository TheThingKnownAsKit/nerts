import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import LoginInput from "../components/LoginInput"; 
import "./Signup.css";

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
      <div id="login-signup">
        <div id="nerts-logo"></div>
        <h2 className="form-title">Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <LoginInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={setUsername}
          />
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />
          <LoginInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <div className="check-box" onClick={handleSignup}>
            ✔
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
