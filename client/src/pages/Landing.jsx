import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import "./Landing.css";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSocket } from "../context/SocketContext";
import Popup from "../components/Popup.Jsx";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(null);
  const { initializeSocket } = useSocket();

  const handleLogin = async (e) => {
    e.preventDefault();

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

    let userCredential = null;

    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
    } catch (error) {
      let errorMessage = "Invalid username or password.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your username.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }
      console.error("Error logging in:", error.message);
      setPopup({
        title: "Login Error",
        message: errorMessage,
      });
      return;
    }

    if (userCredential) {
      initializeSocket();
      navigate("/home");
    }
  };

  // Login on enter-press
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

  const toSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="main centered">
      <Letters />
      <div id="login-signup">
        <h3 className="form-title-landing">Login</h3>
        <form onSubmit={handleLogin} className="login-form">
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
            <CustomTextInput
              type="password"
              placeholder="Password"
              value={password}
              centered={false}
              onChange={(e) => setPassword(e.target.value)}
              max={20}
            />
            <CustomButton
              back={false}
              absolute={false}
              text={"Next"}
              onClick={handleLogin}
            />
          </div>
        </form>
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
