import Hand from "../models/hand.js";
import { FoundationPile } from "../models/piles.js";
import Player from "../models/player.js";

class GameManager {
  constructor() {
    this.games = {};
  }

  startGame(lobbyId, players) {
    const gameState = new GameState();

    players.forEach((playerId) => {
      const player = new Player(playerId);
      gameState.addPlayer(playerId, player);
    });

    this.games[lobbyId] = gameState;
    return gameState;
  }

  /*
  {
    source: {
      card: {
        suit: "hearts",
        rank: 3
      }
    }
    destination: {
      pile: {
        name: "buildPile",
        index: 2
      }
    }
  }
  */

  playCard(lobbyId, playerId, playPayload) {
    const { gameState, player } = this.getPlayer(lobbyId, playerId);

    const { srcPile, srcCardIndex } = getSrcInfoFromCard(
      player,
      playPayload.source
    );
    const destPile = getPile(gameState, player, playPayload.destination);

    const moveContext = {
      player: player,
      srcPile: srcPile,
      srcCardIndex: srcCardIndex,
      destPile: destPile,
    };
    const moveType = `${srcPile.name}-${destPile.name}`;

    const wasMoveMade = gameState.moveHandler.moves[moveType](moveContext);

    return wasMoveMade;
  }

  flipDrawPile(lobbyId, playerId) {
    const { player } = this.getPlayer(lobbyId, playerId);

    const card = player.hand.drawPile.flip();

    return card;
  }

  callNerts(lobbyId, playerId) {
    const { player } = this.getPlayer(lobbyId, playerId);

    if (player.hand.nertsPile.cards.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  getSrcInfoFromCard(player, source) {
    const card = `${source.card.rank}-${source.card.suit}`;
    const cardInfo = player.visibleHand[card];

    const srcPile = null;
    const srcCardIndex = null;

    if (cardInfo.pileName == "buildPile") {
      srcPile = player.hand.buildPiles[cardInfo.pileIndex];
      srcCardIndex = cardInfo.cardIndex;
    } else {
      srcPile = player.hand[cardInfo.pileName];
    }

    return { srcPile, srcCardIndex };
  }

  getPile(gameState, player, destination) {
    if (destination.pileName == "buildPile") {
      return player.hand.buildPiles[destination.pileIndex];
    } else {
      return gameState.foundation[destination.pileIndex];
    }
  }

  getPlayer(lobbyId, playerId) {
    const gameState = this.games[lobbyId];
    const player = gameState.players[playerId];

    return { gameState, player };
  }
}

class GameState {
  constructor() {
    this.players = {};
    this.foundation = [];
    this.moveHandler = new MoveHandler();
  }

  addPlayer(playerId, player) {
    this.players[playerId] = player;

    for (let i = 0; i < 4; i++) {
      this.foundation.push(new FoundationPile());
    }
  }
}

class MoveHandler {
  constructor() {
    this.moves = initializeMoves();
  }
  // DONT FORGET TO HANDLE VISIBLE CARDS ON MOVES
  initializeMoves() {
    return {
      "drawPile-foundationPile": ({ player, srcPile, destPile }) => {
        if (isMoveValid()) {
          const card = srcPile.takeCard();
          destPile.addCard(card);
          player.score++;
        } else {
        }
      },
      "drawPile-buildPile": ({ srcPile, destPile }) => {
        const card = srcPile.takeCard();
        destPile.addCards([card]);
      },
      "buildPile-buildPile": ({ srcPile, srcCardIndex, destPile }) => {
        const cards = srcPile.takeCards(srcCardIndex);
        destPile.addCards(cards);
      },
      "buildPile-foundationPile": ({ player, srcPile, destPile }) => {
        const card = srcPile.takeCards(-1);
        destPile.addCard(card[0]);
        player.score++;
      },
      "nertsPile-buildPile": ({ player, srcPile, destPile }) => {
        const card = srcPile.takeCard();
        destPile.addCards([card]);
        player.score += 2;
      },
      "nertsPile-foundationPile": ({ player, srcPile, destPile }) => {
        const card = srcPile.takeCard();
        destPile.addCard(card);
        player.score += 3;
      },
    };
  }

  isMoveValid() {}
}

export default GameManager;
