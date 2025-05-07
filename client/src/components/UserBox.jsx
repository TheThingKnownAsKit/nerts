import { useNavigate } from "react-router-dom";
import "./UserBox.css";
import profile from "../assets/images/user.png";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSocket } from "../context/SocketContext";

// Sounds
import soundManager from "../logic/soundManager";
import click from "../assets/sounds/click.mp3";

const UserBox = () => {
  const navigate = useNavigate();
  const { userID } = useSocket();
  const [username, setUsername] = useState("Loading...");

  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (!userID) return;

        const userRef = doc(db, "users", userID);
        const [userSnap] = await Promise.all([getDoc(userRef)]);

        if (userSnap.exists()) {
          console.log("Username update");
          setUsername(userSnap.data().username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Error loading username");
      }
    };

    fetchUsername();
  }, [userID]);

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
