import "./RoundDisplay.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useSocket } from "../context/SocketContext.jsx";
import { db } from "../firebase/config";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

const RoundDisplay = ({ round, playerList, lobbyID, endGame }) => {
  const { socket, gameState, userID, host } = useSocket();
  const navigate = useNavigate(); // for navigation

  // Extract scores for each player
  const rankedPlayers = gameState?.players
    ? Object.entries(gameState.players)
        .map(([id, playerData]) => ({
          id,
          score: playerData?.score ?? 0,
        }))
        .sort((a, b) => b.score - a.score)
    : [];

  const handleStartRound = () => {
    if (socket) {
      socket.emit("startRound", lobbyID);
    }
  };

  const handleReturnHome = () => {
    // Update win/loss statistics
    if (rankedPlayers && rankedPlayers.length > 0) {
      const maxScore = Math.max(...rankedPlayers.map((player) => player.score));

      // Update wins/losses for each player
      for (let i = 0; i < rankedPlayers.length; i++) {
        const player = rankedPlayers[i];
        const statsRef = doc(db, "users", player.id, "statistics", "data");

        if (player.score === maxScore) {
          // Increment wins for the player with highest score
          updateDoc(statsRef, { wins: increment(1) });
        } else {
          // Increment losses for other players
          updateDoc(statsRef, { losses: increment(1) });
        }
      }
    }

    socket.emit("leftLobby", { userID, lobbyID });
    navigate("/Home"); // route to Home.jsx
  };

  return (
    <div className="round-display">
      <h1>{endGame === "won" ? "Game Over!" : `Round ${round}:`}</h1>
      <h3>Rankings</h3>
      <ul>
        {rankedPlayers.map((player, index) => (
          <li key={player.id}>
            #{index + 1}: {playerList[player.id] ?? "Unknown"} — {player.score}{" "}
            pts
          </li>
        ))}
      </ul>
      {(endGame === "won" || userID === host) && (
        <CustomButton
          onClick={endGame === "won" ? handleReturnHome : handleStartRound}
          text={endGame === "won" ? "Return Home" : "Next Round"}
        />
      )}
    </div>
  );
};

export default RoundDisplay;
