import Hand from "../models/hand.js";

class GameManager {
    constructor() {
        this.games = {};
    }

    startGame(lobbyId, players) {
        const gameState = {
            hands: {},
            foundation: [],
        };

        players.forEach((playerId) => {
            gameState.hands[playerId] = new Hand();
        });

        this.games[lobbyId] = gameState;
        return gameState;
    }
}

export default GameManager;
