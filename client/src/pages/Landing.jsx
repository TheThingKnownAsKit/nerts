import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import "./Landing.css";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSocket } from "../context/SocketContext";
import Popup from "../components/Popup.jsx";

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

    //on successful login, navigate to home page
    if (userCredential) {
      const uid = userCredential.user.uid;

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
            placeholder="Email/Username"
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
