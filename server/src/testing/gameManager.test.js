import { GameManager, GameState, MoveHandler } from "../game/gameManager";
import { Card, Hand } from "../models/hand";
import Player from "../models/player";

// GAME MANAGER TESTS

test("Creating a lobby gives a 6 character lobby ID string", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();

  expect(lobbyId.length).toBe(6);
});

test("Creating a lobby gives an alphanumeric lobby ID string", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();

  expect(/^[A-Z0-9]+$/.test(lobbyId)).toBe(true);
});

test("Creating a lobby gives a unique lobby ID string", () => {
  const gameManager = new GameManager();
  const lobbyId1 = gameManager.createLobby();
  const lobbyId2 = gameManager.createLobby();

  expect(lobbyId1 != lobbyId2).toBe(true);
});

test("Creating a lobby creates a new entry in games dictionary with a value of null", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();

  expect(gameManager.games[lobbyId]).toBe(null);
});

test("Starting game creates a new GameState object", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();
  const examplePlayerId = ["ABC123"];
  const gameState = gameManager.startGame(lobbyId, examplePlayerId);

  expect(gameState instanceof GameState).toBe(true);
});

test("Starting game with 2 players adds all players to game state", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();
  const examplePlayerIds = ["ABC123", "DEF456"];
  const gameState = gameManager.startGame(lobbyId, examplePlayerIds);

  expect(Object.keys(gameState.players)).toEqual(examplePlayerIds);
});

test("Starting game with no players returns null", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();
  const examplePlayerIds = [];
  const gameState = gameManager.startGame(lobbyId, examplePlayerIds);

  expect(gameState).toEqual(null);
});

// GAME STATE TESTS

test("addPlayer adds player to gameState", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  gameState.addPlayer(player);

  expect(gameState.players[examplePlayerId]).toBe(player);
});

test("addPlayer adds 4 foundation piles to gameState (starting at 0 players/0 piles)", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  gameState.addPlayer(player);

  expect(gameState.foundation.length).toBe(4);
});

test("addPlayer adds 4 foundation piles to gameState (starting at 1 player/4 piles)", () => {
  const examplePlayerId1 = "ABC123";
  const examplePlayerId2 = "DEF456";
  const gameState = new GameState();
  const player1 = new Player(examplePlayerId1);
  const player2 = new Player(examplePlayerId2);
  gameState.addPlayer(player1);
  gameState.addPlayer(player2);

  expect(gameState.foundation.length).toBe(8);
});

test("callNerts returns false when nerts cards are left in the nerts pile", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  gameState.addPlayer(player);
  const nertsCalled = gameState.callNerts(examplePlayerId);

  expect(nertsCalled).toBe(false);
});

test("callNerts returns true when no nerts cards are left in the nerts pile", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  player.hand.nertsPile.cards = [];
  gameState.addPlayer(player);
  const nertsCalled = gameState.callNerts(examplePlayerId);

  expect(nertsCalled).toBe(true);
});

test("Flipping draw pile of 7 cards after initialization results in card of index 2 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
    new Card("diamonds", 5),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[2]);
});

test("Flipping draw pile of 7 cards twice after initialization results in card of index 5 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
    new Card("diamonds", 5),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[5]);
});

test("Flipping draw pile of 7 cards three times after initialization results in card of index 6 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
    new Card("diamonds", 5),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[6]);
});

test("Flipping draw pile of 7 cards four times after initialization results in no card shown (null)", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
    new Card("diamonds", 5),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(null);
});

test("Flipping draw pile of 7 cards five times after initialization results in card of index 2 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
    new Card("diamonds", 5),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[2]);
});

test("Flipping draw pile of 6 cards one time after initialization results in card of index 2 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[2]);
});

test("Flipping draw pile of 6 cards two times after initialization results in card of index 5 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[5]);
});

test("Flipping draw pile of 6 cards three times after initialization results in no card shown (null)", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(null);
});

test("Flipping draw pile of 6 cards four times after initialization results in card of index 2 being shown", () => {
  const examplePlayerId = "ABC123";
  const gameState = new GameState();
  const player = new Player(examplePlayerId);
  const mockDrawPile = [
    new Card("diamonds", 4),
    new Card("clubs", 13),
    new Card("hearts", 6),
    new Card("hearts", 1),
    new Card("clubs", 10),
    new Card("spades", 12),
  ];
  player.hand.drawPile.cards = mockDrawPile;
  gameState.addPlayer(player);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  gameState.flipDrawPile(examplePlayerId);
  const card = gameState.flipDrawPile(examplePlayerId);

  expect(card).toBe(mockDrawPile[2]);
});

// MOVE HANDLER TESTS

test("Draw pile ace to empty foundation pile", () => {
  const gameManager = new GameManager();
  const lobbyId = gameManager.createLobby();
  const examplePlayerId = "ABC123";
  const gameState = gameManager.startGame(lobbyId, [examplePlayerId]);
  const mockDrawPile = [
    new Card("clubs", 3),
    new Card("clubs", 2),
    new Card("clubs", 1),
  ];
  gameState.players[examplePlayerId].hand.drawPile.cards = mockDrawPile;
  gameState.flipDrawPile(examplePlayerId);
  const playPayload = {
    source: {
      card: {
        suit: "clubs",
        rank: 1,
      },
    },
    destination: {
      pile: {
        name: "foundationPile",
        index: 0,
      },
    },
    playerId: examplePlayerId,
    lobbyId: lobbyId,
  };
  const wasPlayed = gameState.playCard(playPayload);

  expect(wasPlayed).toBe(true);
});
