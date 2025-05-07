export const lobbyEvents = (socket) => {
    socket.on("lobbyCreated", ({ lobbyID }) => console.log(`Lobby ${lobbyID} created.`));

    socket.on("playerJoined", ({ playerID }) => console.log(`New player ${playerID} joined.`));

    socket.on("lobbyNotFound", (message) => {
        console.log(message);
    });
};
