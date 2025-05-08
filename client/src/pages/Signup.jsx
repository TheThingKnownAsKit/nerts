import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import "./Signup.css";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useSocket } from "../context/SocketContext";
import Popup from "../components/Popup.jsx";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { initializeSocket } = useSocket();
  const [popup, setPopup] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    //input validation to ensure all fields are filled
    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setPopup({
        title: "Missing Fields",
        message: "Please fill out all fields.",
      });
      return;
    }

    //minimum password length
    if (password.length < 12) {
      setPopup({
        title: "Password Requirements",
        message: "Password must be at least 12 characters long.",
      });
      return;
    }

    //password and confirm password must match
    if (password !== confirmPassword) {
      setPopup({
        title: "Password Mismatch",
        message: "Passwords do not match.",
      });
      return;
    }

    //create the user in firebase
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      initializeSocket(user.uid);

      const userData = {
        uid: user.uid,
        email: user.email,
        username: username,
      };

      // Create user document
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, userData);
      console.log("User document created in Firestore");

      // Create statistics subcollection under the user document
      const userStatisticsRef = doc(
        db,
        "users",
        user.uid,
        "statistics",
        "data"
      );
      const userStatistics = {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        cards_played: 0,
        time_played: 0,
        nerts_called: 0,
      };
      await setDoc(userStatisticsRef, userStatistics);
      console.log("User statistics subcollection created in Firestore");

      // Create a settings subcollection under the user document
      const userSettingsRef = doc(db, "users", user.uid, "settings", "data");
      const userSettings = {
        music_on: 1,
        sfx_on: 1,
        volume: 50,
        background_color: 0,
        tab_hotkey: 1,
        profile_picture: 0,
      };
      await setDoc(userSettingsRef, userSettings);
      console.log("User settings subcollection created in Firestore");

      //redirect to home page upon successful signup
      navigate("/home");
      //catch any firebase errors while signing up
    } catch (error) {
      setPopup({
        title: "Signup Error",
        message: error.message,
      });
    }
  };

  //allow form submission with enter key
  useEffect(() => {
    let keyPressed = false;
    const onKeyDown = (e) => {
      if (e.key === "Enter" && !keyPressed) {
        keyPressed = true;
        if (email && username && password && confirmPassword) {
          handleSignup(e);
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.key === "Enter") {
        keyPressed = false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [email, username, password, confirmPassword]);

  return (
    <div className="main centered">
      {/* animated letters*/}
      <Letters />
      {/* signup form container*/}
      <div id="login-signup" className="su">
        <h3 className="form-title">Sign Up</h3>
        {/* form wrapping all signup inputs */}
        <form onSubmit={handleSignup} className="signup-form">
          {/* email address input */}
          <CustomTextInput
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            centered={false}
            max={30}
          />
          <div className="spacer-1vw"></div>
          {/* username input */}
          <CustomTextInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            centered={false}
            max={30}
          />
          <div className="spacer-1vw"></div>
          {/* password input */}
          <CustomTextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            centered={false}
            max={20}
          />
          <div className="spacer-1vw"></div>
          {/* confirm password input */}
          <CustomTextInput
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            centered={false}
            max={20}
          />
          <div className="spacer-1vw"></div>
          {/* back and next buttons row */}
          <div className="button-row">
            {/* back button could navigate back to login */}
            <CustomButton back={true} absolute={false} text={"Back"} />
            <div className="spacer-1vw"></div>
            <div className="spacer-1vw"></div>
            <div className="spacer-1vw"></div>
            {/* next button triggers handling signup */}
            <CustomButton
              back={false}
              absolute={false}
              text={"Next"}
              onClick={handleSignup}
            />
          </div>
        </form>
      </div>
      {/* renders popup component with error and message*/}
      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

export default Signup;
