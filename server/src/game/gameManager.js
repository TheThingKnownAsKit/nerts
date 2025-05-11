import { FoundationPile } from "../models/piles.js";
import Player from "../models/player.js";

// Game manager model to handle game instances
class GameManager {
    constructor(io) {
        this.io = io;
        this.games = {}; // Dictionary of running games { lobbyId: gameState }
        this.inactivityTimers = {}; // Dictionary of 50s timers for inavtivity for draw pile shuffle { lobbyId: timeout object }
        this.shuffleTimers = {}; // Dictionary of 10s timers for draw pile shuffle { lobbyId: timeout object}
    }

    // Generates a unique lobby ID and it in games dictionary
    createLobby() {
        let lobbyId;

        // Keep generating a 6 character, alphanumeric lobby ID until a unique one is found
        do {
            lobbyId = Math.random().toString(36).slice(2, 8).toUpperCase();
        } while (this.games.hasOwnProperty(lobbyId));

        this.games[lobbyId] = null; // Store lobby ID in games dictionary
        return lobbyId;
    }

    // Initializes gamestate for a given lobby with given players
    startGame(lobbyId, playerIds) {
        // Check for empty player list
        if (playerIds.length == 0) {
            return null;
        }

        const gameState = new GameState(); // Create game state

        // Add each player to the game state
        playerIds.forEach((playerId) => {
            const player = new Player(playerId);
            gameState.addPlayer(player);
        });

        this.games[lobbyId] = gameState; // Add game state to lobby stored in dictionary
        console.log("1: ", lobbyId);
        this.resetShuffleTimers(lobbyId); // Reset/Start timers

        return gameState;
    }

    // Resets timers related to draw pile shuffling for inactivity
    resetShuffleTimers(lobbyId) {
        // Clear both timers
        clearTimeout(this.inactivityTimers[lobbyId]);
        clearTimeout(this.shuffleTimers[lobbyId]);

        // Set long timer that warns players about incoming shuffle
        this.inactivityTimers[lobbyId] = setTimeout(() => {
            this.io.to(lobbyId).emit("shuffleWarning");

            // Set 10 second timer to let players know the draw pile is about to be shuffled
            this.shuffleTimers[lobbyId] = setTimeout(() => {
                const gameState = this.games[lobbyId]; // Get game state
                console.log(this.games);
                // Go through each player in game and shuffle draw pile
                console.log("2: ", lobbyId);
                gameState.getPlayers().forEach((player) => {
                    player.shuffleDrawPile();
                });
                const safeState = JSON.parse(JSON.stringify(gameState));
                this.io.to(lobbyId).emit("drawPileShuffled", safeState);

                this.resetShuffleTimers(lobbyId); // Restart timers
            }, 10000);
        }, 35000);
    }
}

// Game state model to handle game properties and gameplay logic
class GameState {
    constructor() {
        this.players = {}; // Dictionary of players {playerId: player object}
        this.foundation = []; // Array of foundationPile objects
        this.moveHandler = new MoveHandler();
    }

    // Helper function for adding players to a game
    addPlayer(player) {
        this.players[player.playerId] = player;

        // Add 4 foudnation piles per player
        for (let i = 0; i < 4; i++) {
            this.foundation.push(new FoundationPile());
        }
    }

    /* EXAMPLE PAYLOAD
  {
    source: {
      card: {
        suit: "hearts",
        rank: 3
      }
    },
    destination: {
      pile: {
        name: "buildPile",
        index: 2
      }
    },
    playerId: "XTywdu5KJNsrKqTcAAAB",
    lobbyId: "ABCDEF"
  } */

    // Attempts to play a move from a player given the above example payload
    playCard(playPayload, gameManager) {
        const player = this.players[playPayload.playerId]; // Get player making the move

        // Get info about the source card(s) given the card sent from front-end
        const { srcPile, srcCardIndex } = this.getSrcInfoFromCard(player, playPayload.source);
        const destPile = this.getPile(player, playPayload.destination); // Get player's destination pile object

        // Set up info needed for a move
        const moveContext = {
            player: player,
            srcPile: srcPile,
            srcCardIndex: srcCardIndex,
            destPile: destPile,
        };
        const moveType = `${srcPile.name}-${destPile.name}`;

        // Try to perform move
        const moveWasMade = this.moveHandler.tryExecuteMove(moveType, moveContext);

        // If a move was made, reset draw pile shuffle timers
        if (moveWasMade) {
            gameManager.resetShuffleTimers(playPayload.lobbyId);
        }

        return moveWasMade;
    }

    // "Flip" the draw pile and give new top card
    flipDrawPile(playerId) {
        const player = this.players[playerId]; // Get player object
        const card = player.hand.drawPile.flip(); // Flip the player's draw pile and return new "top" card
        player.updateVisibleHand(); // Update visible hand to reflect new top card
        return card;
    }

    // Check if nerts can be called
    callNerts(playerId) {
        const player = this.players[playerId]; // Get player object

        // Ensure the player has no more nerts cards
        if (player.hand.nertsPile.cards.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    // Get necessary info about a specified card attempting to be played
    getSrcInfoFromCard(player, source) {
        const card = `${source.card.rank}-${source.card.suit}`; // Put sent card into format readable by visibleHand dictionary
        const cardInfo = player.visibleHand[card]; // get stored info about the card (such as its parent pile)

        // Initialize necessary info to return
        let srcPile;
        let srcCardIndex;

        // If the card is from the build pile, card index within the pile is needed
        if (cardInfo.pileName == "buildPile") {
            srcPile = player.hand.buildPiles[cardInfo.pileIndex]; // Store player's specific pile object
            srcCardIndex = cardInfo.cardIndex; // Store index of card within this pile
        } else {
            srcPile = player.hand[cardInfo.pileName]; // Store player's specific pile object
        }

        return { srcPile, srcCardIndex };
    }

    // Returns a specified play destination pile of a player
    getPile(player, destination) {
        // If pile is a build pile, the pile index is needed
        if (destination.pile.name == "buildPile") {
            return player.hand.buildPiles[destination.pile.index];
        } else {
            // Foudnation pile is the only other destination pile
            return this.foundation[destination.pile.index];
        }
    }

    // Initializes each player with a new random starting hand
    startRound() {
        // Reset all cards in foundation
        this.foundation.forEach((pile) => {
            pile.cards = [];
        });

        // Loop through each player and create a new hand
        this.getPlayers().forEach((player) => {
            player.createNewHand();
            player.updateVisibleHand();
            player.updateScore();
        });
    }

    // Returns a list of player objects belonging to game state
    getPlayers() {
        return Object.values(this.players);
    }
}

// Class to handle making moves in a game
class MoveHandler {
    constructor() {
        this.moves = this.initializeMoves();
    }

    // Helper function to attempt to make a move
    tryExecuteMove(moveType, moveContext) {
        return this.moves[moveType](moveContext);
    }

    // Initializes moves dictionary {"srcPile-destPile": ({ moveContext }) => {move details...}}
    initializeMoves() {
        return {
            // Handles playing a card from the draw pile to a foundation pile
            "drawPile-foundationPile": ({ player, srcPile, destPile }) => {
                const card = srcPile.seeCard(); // Get (but don't remove) top draw card

                // If move with this card is valid (card added to destination pile)...
                if (destPile.addCard(card)) {
                    srcPile.takeCard(); // Remove card from source
                    player.updateVisibleHand(); // Update player's visible hand
                    player.score++; // Update player score
                    return true; // Report success
                } else {
                    return false; // Move not valid, report failure
                }
            },
            // Handles playing a card from the draw pile to a build pile
            "drawPile-buildPile": ({ player, srcPile, destPile }) => {
                const card = srcPile.seeCard(); // Get (but don't remove) top draw card

                // If move with this card is valid (card added to destination pile)...
                if (destPile.addCards([card])) {
                    srcPile.takeCard(); // Remove card from source
                    player.updateVisibleHand(); // Update player's visible hand
                    return true; // Report success
                } else {
                    return false; // Move not valid, report failure
                }
            },
            // Handles playing a card from a build pile to another build pile
            "buildPile-buildPile": ({ player, srcPile, srcCardIndex, destPile }) => {
                const cards = srcPile.seeCards(srcCardIndex); // Get (but don't remove) selected build cards

                // If move with card(s) is valid (card(s) added to destination pile)...
                if (destPile.addCards(cards)) {
                    srcPile.takeCards(srcCardIndex); // Remove card(s) from source
                    player.updateVisibleHand();
                    return true;
                } else {
                    return false; // Move not valid, report failure
                }
            },
            // Handles playing a card from a build pile to a foundation pile
            "buildPile-foundationPile": ({ player, srcPile, destPile }) => {
                const card = srcPile.seeCards(-1); // Get (but don't remove) top build card

                // If move with this card is valid (card added to destination pile)...
                if (destPile.addCard(card[0])) {
                    srcPile.takeCards(-1); // Remove card from source
                    player.updateVisibleHand(); // Update player's visible hand
                    player.score++; // Update player score
                    return true; // Report success
                } else {
                    return false; // Move not valid, report failure
                }
            },
            // Handles playing a card from the nerts pile to a build pile
            "nertsPile-buildPile": ({ player, srcPile, destPile }) => {
                const card = srcPile.seeCard(); // Get (but don't remove) top nerts card

                // If move with this card is valid (card added to destination pile)...
                if (destPile.addCards([card])) {
                    srcPile.takeCard(); // Remove card from source
                    player.updateVisibleHand(); // Update player's visible hand
                    player.score += 2; // Update player score
                    return true; // Report success
                } else {
                    return false; // Move not valid, report failure
                }
            },
            // Handles playing a card from the nerts pile to a foundation pile
            "nertsPile-foundationPile": ({ player, srcPile, destPile }) => {
                const card = srcPile.seeCard(); // Get (but don't remove) top nerts card

                // If move with this card is valid (card added to destination pile)...
                if (destPile.addCard(card)) {
                    srcPile.takeCard(); // Remove card from source
                    player.updateVisibleHand(); // Update player's visible hand
                    player.score += 3; // Update player score
                    return true; // Report success
                } else {
                    return false; // Move not valid, report failure
                }
            },
        };
    }
}

export { GameManager, GameState, MoveHandler };
