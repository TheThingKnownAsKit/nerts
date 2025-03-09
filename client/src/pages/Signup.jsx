import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import "./Signup.css";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    //TODO: This might need to change to actual username and email stuff
    const email = username;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up:", userCredential.user);
      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

    // Signup on enter-press
    let keyPressed = false;
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !keyPressed) {
        keyPressed = true;
        if (email && username && password && confirmPassword) {
          handleSignup(e);
        }
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        keyPressed = false;
      }
    });

  return (
    <div className="main centered">
      <Letters />
      <div id="login-signup" className="su">
        <h3 className="form-title">Sign Up</h3>

        <form onSubmit={handleSignup} className="signup-form">
        <CustomTextInput
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            centered={false}
            max={30}
          />
          <div className="spacer-1vw"></div>
          <CustomTextInput
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            centered={false}
            max={30}
          />
          <div className="spacer-1vw"></div>
          <CustomTextInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            centered={false}
            max={30}
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
            <CustomButton
              back={false}
              absolute={false}
              text={"Next"}
              onClick={handleSignup}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
