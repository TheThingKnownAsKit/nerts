import { Card, Deck, Hand } from "../models/hand.js";

// HAND TESTS

test("Initializing Hand object with no arguments gives nerts pile count of 13", () => {
  const hand = new Hand();

  expect(hand.nertsPile.cards.length).toBe(13);
});

test("Initializing Hand object with no arguments gives build pile count of 4", () => {
  const hand = new Hand();

  expect(hand.buildPiles.length).toBe(4);
});

test("Each build pile has 1 card after Hand initialization", () => {
  const hand = new Hand();

  hand.buildPiles.forEach((pile) => {
    expect(pile.cards.length).toBe(1);
  });
});

test("Draw pile has a size of 35 with default Hand initialization", () => {
  const hand = new Hand();

  expect(hand.drawPile.cards.length).toBe(35);
});

test("Draw pile has a size of 33 with a Hand of 14 nerts cards and 5 build piles", () => {
  const numNertsCards = 14;
  const numBuildPiles = 5;
  const hand = new Hand(numNertsCards, numBuildPiles);

  expect(hand.drawPile.cards.length).toBe(33);
});

test("Initializing Hand object with just nerts card count of 10 gives nerts pile count of 10 and a build pile count of 4", () => {
  const numNertsCards = 10;
  const hand = new Hand(numNertsCards);

  expect(hand.nertsPile.cards.length).toBe(numNertsCards);
});

test("Initializing Hand object with just build pile count of 5 gives nerts pile count of 13 and a build pile count of 5", () => {
  const numBuildPiles = 5;
  const hand = new Hand(undefined, numBuildPiles);

  expect(hand.buildPiles.length).toBe(numBuildPiles);
});

test("All piles in Hand contain unique cards", () => {
  const hand = new Hand();
  const allPileCards = [
    ...hand.nertsPile.cards,
    ...hand.buildPiles.flatMap((pile) => pile.cards),
    ...hand.drawPile.cards,
  ];
  const cardStrings = allPileCards.map((card) => card.toString());
  const uniqueCards = new Set(cardStrings);

  expect(uniqueCards.size).toBe(52);
});

// CARD TESTS

test("To string function of a Card (ace of spades) within a hand returns a string in the form '1-spades'", () => {
  const suit = "spades";
  const rank = 1;
  const expectedStringRepresentation = "1-spades";
  const card = new Card(suit, rank);

  expect(card.toString()).toBe(expectedStringRepresentation);
});

// DECK TESTS

test("Deck object initializes 52 unique cards", () => {
  const deck = new Deck();
  const uniqueCards = new Set(deck.cards.map((card) => card.toString()));

  expect(uniqueCards.size).toBe(52);
});
