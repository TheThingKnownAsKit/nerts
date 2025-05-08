import "./RoundDisplay.css";
import { useState } from "react";
import CustomButton from "./CustomButton";
import { useSocket } from "../context/SocketContext.jsx";

const RoundDisplay = ({ round, playerList, lobbyID }) => {
    const { socket, gameState, userID, host } = useSocket(); // Need this for database stuff

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
    }

    return (
      <div className="round-display">
        <h1>Round {round}:</h1>
        <h3>Rankings</h3>
        <ul>
          {rankedPlayers.map((player, index) => (
            <li key={player.id}>
              #{index + 1}: {playerList[player.id] ?? "Unknown"} — {player.score} pts
            </li>
          ))}
        </ul>
        {userID === host && (
              <CustomButton onClick={handleStartRound} text="Next Round" />
            )}
      </div>
    );
  };

export default RoundDisplay;
