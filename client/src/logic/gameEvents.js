export const gameEvents = (socket) => {
  socket.on("gameStarted", (gameState) => {
    console.log(gameState);
  });
};
