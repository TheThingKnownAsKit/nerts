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

  playCard(lobbyId, playerId, playInfo) {
    const { gameState, player } = this.getPlayer(lobbyId, playerId);

    const srcPile = getPile(
      gameState,
      player,
      playInfo.source.pileType,
      playInfo.source.pileIndex
    );
    const destPile = getPile(
      gameState,
      player,
      playInfo.destination.pileType,
      playInfo.destination.pileIndex
    );

    const moveType = `${srcPile.name}-${destPile.name}`;

    const moveHandler = new MoveHandler();

    moveHandler.moves[moveType](
      player,
      srcPile,
      playInfo.source.cardIndex,
      destPile
    );

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

  getPile(gameState, player, pileType, pileIndex) {
    switch (pileType) {
      case "nertsPile":
        return player.hand.nertsPile;
      case "drawPile":
        return player.hand.drawPile;
      case "buildPile":
        return player.hand.buildPile[pileIndex];
      case "foundationPile":
        return gameState.foundation[pileIndex];
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
      "drawPile-foundationPile": (player, drawPile, _, foundationPile) => {
        const card = drawPile.takeCard();
        foundationPile.addCard(card);
        player.score++;
      },
      "drawPile-buildPile": (_, drawPile, __, buildPile) => {
        const card = drawPile.takeCard();
        buildPile.addCards([card]);
      },
      "buildPile-buildPile": (_, buildPileSrc, index, buildPileDest) => {
        const cards = buildPileSrc.takeCards(index);
        buildPileDest.addCards(cards);
      },
      "buildPile-foundationPile": (player, buildPile, _, foundationPile) => {
        const card = buildPile.takeCards(-1);
        foundationPile.addCard(card[0]);
        player.score++;
      },
      "nertsPile-buildPile": (player, nertsPile, _, buildPile) => {
        const card = nertsPile.takeCard();
        buildPile.addCards([card]);
        player.score += 2;
      },
      "nertsPile-foundationPile": (player, nertsPile, _, foundationPile) => {
        const card = nertsPile.takeCard();
        foundationPile.addCard(card);
        player.score += 3;
      },
    };
  }
}

export default GameManager;
