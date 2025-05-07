import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import profile from "../assets/images/user.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSocket } from "../context/SocketContext";
import "./User.css";

function User() {
  const { userID } = useSocket();
  const [username, setUsername] = useState("Loading...");
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

        const [userSnap, statsSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(statsRef),
        ]);

        if (userSnap.exists()) {
          setUsername(userSnap.data().username);
        }

        if (statsSnap.exists()) {
          console.log("Raw stats data:", statsSnap.data());
          setStats({
            cardsPlayed: statsSnap.data().cards_played || 0,
            gamesPlayed: statsSnap.data().games_played || 0,
            gamesLost: statsSnap.data().losses || 0,
            nertsCalled: statsSnap.data().nerts_called || 0,
            timePlayed: statsSnap.data().time_played || 0,
            gamesWon: statsSnap.data().wins || 0,
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
          src={profile}
          alt="Profile picture"
        />
        <h3 className="user-name no-select">{username}</h3>
      </div>
      <div className="user-edit">
        <h3 className="change-user-image no-select">
          <u>Change Icon</u>
        </h3>
        <h3 className="change-user-name no-select">
          <u>Change Username</u>
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
    </div>
  );
}

export default User;
