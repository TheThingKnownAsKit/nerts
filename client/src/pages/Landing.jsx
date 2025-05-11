import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSocket } from "../context/SocketContext";

import Popup from "../components/Popup.jsx";
import Letters from "../components/Letters";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";

import "./Landing.css";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(null);
  const { initializeSocket } = useSocket();

  const handleLogin = async (e) => {
    e.preventDefault();

    //input validation checks and rende respective popup
    if (!username.trim() && !password.trim()) {
      setPopup({
        title: "Input Error",
        message: "Please enter both username and password.",
      });
      return;
    }
    if (!username.trim()) {
      setPopup({
        title: "Input Error",
        message: "Please enter your username.",
      });
      return;
    }
    if (!password.trim()) {
      setPopup({
        title: "Input Error",
        message: "Please enter your password.",
      });
      return;
    }
    //declared variable to hold result of firebase sign in
    let userCredential = null;

    //attempt to sign in with Firebase Authentication
    //passing in auth instance, entered username, and password
    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
    } catch (error) {
      //if anything goes wrong in login process (incorrect password, no user found, etc)
      //popup with error message if failed
      let errorMessage = "Invalid username or password.";
      setPopup({
        title: "Login Error",
        message: errorMessage,
      });
      return;
    }

    // If this user has missing database information somehow, make it and initialize it to default values
    if (userCredential) {
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (userDoc.exists()) {
        const settingsRef = doc(db, "users", uid, "settings", "data");
        const statisticsRef = doc(db, "users", uid, "statistics", "data");

        if (!(await getDoc(settingsRef)).exists()) {
          const userSettings = {
            music_on: 1,
            sfx_on: 1,
            volume: 50,
            background_color: 0,
            tab_hotkey: 1,
            profile_picture: 0,
          };
          await setDoc(settingsRef, userSettings);
          console.log(
            "User settings subcollection created in Firestore on login"
          );
        }

        if (!(await getDoc(statisticsRef)).exists()) {
          const userStatistics = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            cards_played: 0,
            time_played: 0,
            nerts_called: 0,
          };
          await setDoc(statisticsRef, userStatistics);
          console.log(
            "User statistics subcollection created in Firestore on login"
          );
        }
      }

      //on successful login, navigate to home page
      initializeSocket(uid);
      navigate("/home");
    }
  };

  //login on enter-press
  useEffect(() => {
    let keyPressed = false;

    const onKeyDown = (e) => {
      if (e.key === "Enter" && !keyPressed) {
        keyPressed = true;
        if (username && password) {
          handleLogin(e);
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

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [username, password]);

  //navigate to signup page
  const toSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="main centered">
      {/* animated letters component */}
      <Letters />
      <div id="login-signup">
        <h3 className="form-title-landing">Login</h3>
        {/* login elements */}
        <form onSubmit={handleLogin} className="login-form">
          {/* username/email input */}
          <CustomTextInput
            type="text"
            placeholder="Email"
            value={username}
            centered={false}
            onChange={(e) => setUsername(e.target.value)}
            max={30}
          />

          <div className="spacer-1vw"></div>

          <div className="password-row">
            {/* password input */}
            <CustomTextInput
              type="password"
              placeholder="Password"
              value={password}
              centered={false}
              onChange={(e) => setPassword(e.target.value)}
              max={30}
            />
            {/* “Next” button to submit form */}
            <CustomButton
              back={false}
              absolute={false}
              text={"Next"}
              onClick={handleLogin}
            />
          </div>
        </form>
        {/* link to signup */}
        <div className="signup-link">
          <p>Don't have an account?</p>
          <CustomButton
            back={false}
            absolute={false}
            text={"Sign Up!"}
            onClick={toSignup}
          />
        </div>
      </div>

      {/* popup for error or info messages */}
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

export default Landing;
