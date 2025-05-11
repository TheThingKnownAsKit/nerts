import { useNavigate } from "react-router-dom";
import "./UserBox.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSocket } from "../context/SocketContext";

// Sounds
import soundManager from "../logic/soundManager";
import click from "../assets/sounds/click.mp3";

/**
 * UserBox component displays the current user's profile picture and username. Clicking navigates to the user settings page.
 */
const UserBox = () => {
  const navigate = useNavigate();
  const { userID } = useSocket();
  const [username, setUsername] = useState("Loading...");
  const [profilePic, setProfilePic] = useState("/icons/pic0.png");

  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userID) return;

        const userRef = doc(db, "users", userID);
        const settingsRef = doc(db, "users", userID, "settings", "data");

        const [userSnap, settingsSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(settingsRef),
        ]);

        if (userSnap.exists()) {
          setUsername(userSnap.data().username);
        }

        if (settingsSnap.exists()) {
          const picIndex = settingsSnap.data().profile_picture ?? 0;
          setProfilePic(`/icons/pic${picIndex}.png`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Error loading username");
      }
    };

    fetchUserData();
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
        <img src={profilePic} alt="User Profile" />
      </div>

      <div className="username" onClick={handleUserClick}>
        {username}
      </div>
    </div>
  );
};

export default UserBox;
