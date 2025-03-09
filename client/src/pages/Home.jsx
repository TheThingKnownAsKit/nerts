import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import UserBox from "../components/UserBox";
import "./Home.css";

// Sounds
import soundManager from "../logic/soundManager.js";
import backgroundMusic from "../assets/sounds/background.mp3";
import click from "../assets/sounds/click.mp3";
import SoundControl from "../components/SoundControl.jsx";

function Home() {
  const navigate = useNavigate();

  soundManager.loadSound("click", click);
  if (!soundManager.backgroundMusic) {
    soundManager.playBackgroundMusic(backgroundMusic);
  }
  function playClick() {
    soundManager.playSound("click");
  }

  return (
    <div className="main centered">
      <Letters />
      <h1
        onClick={() => navigate("/host")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/host");
          }
        }}
      >
        PLAY
      </h1>
      <h2
        onClick={() => navigate("/rules")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/rules");
          }
        }}
      >
        RULES
      </h2>
      <h2
        onClick={() => navigate("/settings")}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/settings");
          }
        }}
      >
        SETTINGS
      </h2>
      <UserBox />
      <SoundControl />
    </div>
  );
}

export default Home;
