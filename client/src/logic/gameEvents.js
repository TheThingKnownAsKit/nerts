export const gameEvents = (socket, setGameState) => {
  socket.on("gameStarted", (gameState) => {
    setGameState(gameState);
  });

  socket.on("drawPileShuffled", (gameState) => {
    setGameState(gameState);
  });
};
