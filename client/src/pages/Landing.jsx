import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import CustomTextInput from "../components/CustomTextInput"; 
import CustomButton from '../components/CustomButton'
import "./Landing.css";

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

  const toSignup = () => {
    navigate("/signup");
  }

  return (
    <div className="main centered">
      <Letters />
      <div id="login-signup">
        <h3 className="form-title-landing">Login</h3>
        <form onSubmit={handleLogin} className="login-form">
          <CustomTextInput
            type="text"
            placeholder="Username"
            value={username}
            centered={false}
            onChange={(e) => setUsername(e.target.value)}
            max={20}
          />

          <div className="spacer-1vw"></div>

          <div className="password-row">
            <CustomTextInput
              type="password"
              placeholder="Password"
              value={password}
              centered={false}
              onChange={(e) => setPassword(e.target.value)}
              max={20}
            />
            <CustomButton back={false} absolute={false} text={"Next"} onClick={handleLogin}/>
          </div>
        </form>
        <div className="signup-link">
          <p>Don't have an account?</p>
          <CustomButton back={false} absolute={false} text={"Sign Up!"} onClick={toSignup}/>
        </div>
        </div>
      </div>
  );
}

export default Landing;
