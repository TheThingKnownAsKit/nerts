import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import "./Signup.css";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";

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
          <CustomTextInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            centered={false}
            max={20}
          />
          <div className="spacer-1vw"></div>
          <CustomTextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            centered={false}
            max={20}
          />
          <div className="spacer-1vw"></div>
          <CustomTextInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            centered={false}
            max={20}
          />
          <div className="spacer-1vw"></div>
          <div className="button-row">
            <CustomButton back={true} absolute={false} text={"Back"} />
            <div className="spacer-1vw"></div>
            <div className="spacer-1vw"></div>
            <div className="spacer-1vw"></div>
            <CustomButton back={false} absolute={false} text={"Next"} onClick={handleSignup}/>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
