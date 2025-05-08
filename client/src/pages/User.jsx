import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import profile from "/icons/pic0.png"; // default image
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSocket } from "../context/SocketContext";
import "./User.css";

function User() {
  const { userID } = useSocket();
  const [username, setUsername] = useState("Loading...");

  const [showPopup, setShowPopup] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [selectedProfile, setSelectedProfile] = useState(profile); // path string
  const [editedProfile, setEditedProfile] = useState(0); // numeric index

  const [stats, setStats] = useState({
    cardsPlayed: 0,
    gamesPlayed: 0,
    gamesLost: 0,
    nertsCalled: 0,
    timePlayed: 0,
    gamesWon: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userID) return;

        const userRef = doc(db, "users", userID);
        const statsRef = doc(db, "users", userID, "statistics", "data");
        const settingsRef = doc(db, "users", userID, "settings", "data");

        const [userDoc, statsDoc, settingsDoc] = await Promise.all([
          getDoc(userRef),
          getDoc(statsRef),
          getDoc(settingsRef),
        ]);

        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setEditedUsername(userDoc.data().username);
        }

        if (settingsDoc.exists()) {
          const profileIndex = settingsDoc.data().profile_picture ?? 0;
          setSelectedProfile(`/icons/pic${profileIndex}.png`);
          setEditedProfile(profileIndex);
          console.log("Profile picture index:", profileIndex);
        }
        
        if (statsDoc.exists()) {
          console.log("Raw stats data:", statsDoc.data());
          setStats({
            cardsPlayed: statsDoc.data().cards_played || 0,
            gamesPlayed: statsDoc.data().games_played || 0,
            gamesLost: statsDoc.data().losses || 0,
            nertsCalled: statsDoc.data().nerts_called || 0,
            timePlayed: statsDoc.data().time_played || 0,
            gamesWon: statsDoc.data().wins || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Error loading username");
      }
    };

    fetchUserData();
  }, [userID]);

  return (
    <div className="main centered">
      <CustomButton back={true} absolute={true} text={"Back"} />

      <div className="user-header">
        <img
          className="user-image no-select"
          src={selectedProfile}
          alt="Profile picture"
        />
        <h3 className="user-name no-select">{username}</h3>
      </div>
      <div
        className="user-edit"
        onClick={() => {
          setEditedUsername(username);
          const picIndex = parseInt(selectedProfile.match(/pic(\d+)/)?.[1] || "0");
          setEditedProfile(picIndex);
          setShowPopup(true);
        }}
      >
        <h3 className="edit-profile no-select">
          <u>Edit Profile</u>
        </h3>
      </div>
      <div className="stats">
        <h3 className="games-played">
          Games Played:
          <span className="num-gp">{stats.gamesPlayed}</span>
        </h3>
        <h3 className="games-won">
          Games Won:
          <span className="num-gw">{stats.gamesWon}</span>
        </h3>
        <h3 className="nerts-called">
          Nerts Called:
          <span className="num-nc">{stats.nertsCalled}</span>
        </h3>
        <h3 className="cards-played">
          Cards Played:
          <span className="num-cp">{stats.cardsPlayed}</span>
        </h3>
        <h3 className="win-loss">
          Win/Loss Ratio:
          <span className="wl-ratio">
            {(
              stats.gamesWon / Math.max(stats.gamesPlayed - stats.gamesWon, 1)
            ).toFixed(2)}
          </span>
        </h3>
        <h3 className="time-played">
          Total Time Played:
          <span className="total-tp">{stats.timePlayed}</span>
        </h3>
      </div>

      {showPopup && (
        <div className="update-box">
          <h2>Edit Profile</h2>

          <label htmlFor="username-input">Username:</label>
          <input
            id="username-input"
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="username-input"
          />

          <div className="profile-pic-selection">
            <p>Select a profile picture:</p>
            <div className="profile-pic-grid">
              {Array.from({ length: 5 }, (_, i) => (
                <img
                  key={i}
                  src={`/icons/pic${i + 1}.png`}
                  alt={`Profile ${i + 1}`}
                  className={`profile-pic-option ${
                    editedProfile === i + 1 ? "selected" : ""
                  }`}
                  onClick={() => setEditedProfile(i + 1)}
                />
              ))}
            </div> 
          </div>

          <div className="popup-buttons">
            <CustomButton
              text="Save"
              onClick={async () => {
                try {
                  const userRef = doc(db, "users", userID);
                  const settingsRef = doc(db, "users", userID, "settings", "data");

                  await updateDoc(userRef, {
                    username: editedUsername,
                  });

                  await updateDoc(settingsRef, {
                    profile_picture: editedProfile,
                  });

                  setUsername(editedUsername);
                  setSelectedProfile(`/icons/pic${editedProfile}.png`);
                  setShowPopup(false);
                } catch (error) {
                  console.error("Failed to update user profile:", error);
                }
              }}
            />
            <CustomButton
              text="Cancel"
              onClick={() => {
                setEditedUsername(username); // Reset username field
                setEditedProfile(parseInt(selectedProfile.match(/pic(\d+)/)?.[1] || "0"));
                setShowPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
