import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import UserBox from "../components/UserBox";
import CustomButton from "../components/CustomButton";
import SoundControl from "../components/SoundControl";
import "./Leaderboard.css";
import { useSocket } from "../context/SocketContext";

function Leaderboard() {
  const { userID } = useSocket();
  const [leaderboards, setLeaderboards] = useState({
    cardsPlayed: [],
    gamesWon: [],
    winLoss: [],
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!auth.currentUser) {
        console.warn("User must be logged in to view leaderboard.");
        return;
      }

      try {
        const usersCollection = collection(db, "users");
        const userDocsSnapshot = await getDocs(usersCollection);
        const allUsersData = [];

        const statPromises = userDocsSnapshot.docs.map(async (userDoc) => {
          const userId = userDoc.id;
          const userData = userDoc.data();
          const username = userData.username ?? "Unnamed";

          const statsRef = doc(db, "users", userId, "statistics", "data");
          const statsSnap = await getDoc(statsRef);

          if (statsSnap.exists()) {
            const stats = statsSnap.data();
            allUsersData.push({
              uid: userId,
              username,
              cardsPlayed: stats.cards_played ?? 0,
              gamesWon: stats.wins ?? 0,
              gamesPlayed: stats.games_played ?? 0,
              winLoss:
                stats.wins && stats.games_played
                  ? stats.wins / Math.max(stats.games_played - stats.wins, 1)
                  : 0,
            });
          }
        });

        await Promise.all(statPromises);

        const topCardsPlayed = [...allUsersData]
          .sort((a, b) => b.cardsPlayed - a.cardsPlayed)
          .slice(0, 20);
        const topGamesWon = [...allUsersData]
          .sort((a, b) => b.gamesWon - a.gamesWon)
          .slice(0, 20);
        const topWinLoss = [...allUsersData]
          .sort((a, b) => b.winLoss - a.winLoss)
          .slice(0, 20);

        setLeaderboards({
          cardsPlayed: topCardsPlayed,
          gamesWon: topGamesWon,
          winLoss: topWinLoss,
        });
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, [userID]);

  return (
    <div className="main centered">
        <CustomButton back={true} absolute={true} text={"Back"} />
      <UserBox />
      <SoundControl />
      <h3 className="leaderboard-title">RANKINGS</h3>

      <div className="leaderboard-container">
        <div className="scroll-box">
          <LeaderboardSection
            title="Top Cards Played"
            data={leaderboards.cardsPlayed}
            statKey="cardsPlayed"
          />
          <LeaderboardSection
            title="Top Games Won"
            data={leaderboards.gamesWon}
            statKey="gamesWon"
          />
          <LeaderboardSection
            title="Top Win/Loss Ratio"
            data={leaderboards.winLoss}
            statKey="winLoss"
            format={(val) => val.toFixed(2)}
          />
        </div>
      </div>
    </div>
  );
}

function LeaderboardSection({ title, data, statKey, format }) {
  return (
    <div className="board-section">
      <h2>{title}</h2>
      <ol>
        {data.map((user, i) => (
            <li key={i} className="leaderboard-entry">
                <span className="entry-name">{user.username}</span>
                <span className="entry-dots"></span>
                <span className="entry-value">{format ? format(user[statKey]) : user[statKey]}</span>
            </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
