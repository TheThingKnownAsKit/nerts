export const gameEvents = (socket, setGameState) => {
  socket.on("gameStarted", (gameState) => {
    console.log(gameState);
    setGameState(gameState);
  });
};
