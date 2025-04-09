import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import "./Landing.css";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSocket } from "../context/SocketContext";

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { initializeSocket } = useSocket();

  const handleLogin = async (e) => {
    e.preventDefault();

    let userCredential = null;

    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
    } catch (error) {
      // TODO: Different error messages on different login mistake cases
      console.error("Error logging in:", error.message);
      console.log(error);
    } finally {
      if (userCredential) {
        initializeSocket();
        navigate("/home");
      }
    }
  };

  // Login on enter-press
  let keyPressed = false;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !keyPressed) {
      keyPressed = true;
      if (username && password) {
        handleLogin(e);
      }
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      keyPressed = false;
    }
  });

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
    </div>
  );
}

export default Landing;
