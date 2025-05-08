import "./RoundDisplay.css";
import { useState } from "react";
import CustomButton from "./CustomButton";
import { useSocket } from "../context/SocketContext.jsx";

const RoundDisplay = ({ round, players, lobbyID }) => {
    const { socket, gameState, userID, host } = useSocket(); // Need this for database stuff

    // Extract scores for each player
    const rankedPlayers = players
      .map((id) => {
        const score = gameState?.players?.[id]?.score ?? 0;
        return { id, score };
      })
      .sort((a, b) => b.score - a.score); // Sort descending by score

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
              #{index + 1}: {player.id} — {player.score} pts
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
