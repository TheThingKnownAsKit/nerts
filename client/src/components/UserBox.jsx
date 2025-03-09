import { useNavigate } from "react-router-dom";
import "./UserBox.css";
import profile from "../assets/images/user.png";

// Sounds
import soundManager from "../logic/soundManager";
import click from "../assets/sounds/click.mp3";

const UserBox = () => {
  const navigate = useNavigate();
  const username = "Username";

  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  const handleUserClick = () => {
    navigate("/user");
  };

  return (
    <div
      className="user-box"
      onMouseEnter={playClick}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleUserClick(e);
        }
      }}
    >
      <div className="icon" onClick={handleUserClick}>
        <img src={profile} alt="User Profile" />
      </div>

      <div className="username" onClick={handleUserClick}>
        {username}
      </div>
    </div>
  );
};

export default UserBox;
