import "./RoundDisplay.css";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useSocket } from "../context/SocketContext.jsx";

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
    navigate("/Home"); // route to Home.jsx
  };

  return (
    <div className="round-display">
      <h1>{endGame === "won" ? "Game Over!" : `Round ${round}:`}</h1>
      <h3>Rankings</h3>
      <ul>
        {rankedPlayers.map((player, index) => (
          <li key={player.id}>
            #{index + 1}: {playerList[player.id] ?? "Unknown"} — {player.score} pts
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
