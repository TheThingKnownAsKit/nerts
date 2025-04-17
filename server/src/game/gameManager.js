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
      const player = new Player(playerId, new Hand(), 0);
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
      pileName: "buildPile",
      pileIndex: 2
    }
  }
  */

  playCard(lobbyId, playerId, playPayload) {
    const { gameState, player } = this.getPlayer(lobbyId, playerId);

    const srcCards = getPileCardsFromCard(player, playPayload.source);
    const destPile = getPile(gameState, player, playPayload.destination);

    const moveType = `${srcPile.name}-${destPile.name}`; // TODO: handle new move with src cards and dest piles (scoring?)

    const moveHandler = new MoveHandler();

    moveHandler.moves[moveType](player, srcCards, destPile);

    return true;
  }

  flipDrawPile(lobbyId, playerId) {
    const { _, player } = this.getPlayer(lobbyId, playerId);

    const card = player.hand.drawPile.flip();

    return card;
  }

  callNerts(lobbyId, playerId) {
    const { _, player } = this.getPlayer(lobbyId, playerId);

    if (player.hand.nertsPile.cards.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  // TODO: make function take from pile and return array of card(s)
  getPileCardsFromCard(player, source) {
    const card = `${source.card.rank}-${source.card.suit}`;
    const cardInfo = player.hand.visibleHand[card]; // pileName, pileIndex, cardIndex // TODO: add visibleHand to player

    const pile = null;
    const cards = [];
    if (cardInfo.pileName == "buildPile") {
      pile = player.hand[cardInfo.pileName][cardInfo.pileIndex];
      cards = pile.cards.splice(cardInfo.cardIndex);
    } else {
      pile = player.hand[pile.pileName];
      cards.push(pile.takeCard());
    }

    return cards;
  }
  getPile(gameState, player, destination) {
    if (destination.pileName == "buildPile") {
      return player.hand[destination.pileName][destination.pileIndex];
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

  initializeMoves() {
    return {
      "drawPile-foundationPile": (player, drawPile, foundationPile) => {
        const card = drawPile.takeCard();
        foundationPile.addCard(card);
        player.score++;
      },
      "drawPile-buildPile": (_, drawPile, buildPile) => {
        const card = drawPile.takeCard();
        buildPile.addCards([card]);
      },
      "buildPile-buildPile": (_, buildPileSrc, buildPileDest) => {
        const cards = buildPileSrc.takeCards(index);
        buildPileDest.addCards(cards);
      },
      "buildPile-foundationPile": (player, buildPile, foundationPile) => {
        const card = buildPile.takeCards(-1);
        foundationPile.addCard(card[0]);
        player.score++;
      },
      "nertsPile-buildPile": (player, nertsPile, buildPile) => {
        const card = nertsPile.takeCard();
        buildPile.addCards([card]);
        player.score += 2;
      },
      "nertsPile-foundationPile": (player, nertsPile, foundationPile) => {
        const card = nertsPile.takeCard();
        foundationPile.addCard(card);
        player.score += 3;
      },
    };
  }
}

export default GameManager;
