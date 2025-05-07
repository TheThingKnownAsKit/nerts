import "./RoundDisplay.css";
import { useState } from "react";

const RoundDisplay = ({ round, players, gameState, userID, host }) => {
  // Extract scores for each player
  const rankedPlayers = players
    .map((id) => {
      const score = gameState?.players?.[id]?.score ?? 0;
      return { id, score };
    })
    .sort((a, b) => b.score - a.score); // Sort descending by score

  startButtonPress = () => {
    // Emit an event to the server to start the next round
    socket.emit("startNextRound", { roomID: lobbyID });
  };

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
        <CustomButton onClick={startButtonPress} text="Next Round" />
      )}
    </div>
  );
};

export default RoundDisplay;
