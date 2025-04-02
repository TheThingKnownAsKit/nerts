import Card from "./card.js";

class Deck {
  constructor() {
    this.suits = ["hearts", "diamonds", "clubs", "spades"];
    this.ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    this.cards = this.createRandomDeck();
  }

  createRandomDeck() {
    // Generate all 52 cards
    let deck = [];
    for (let suit of this.suits) {
      for (let rank of this.ranks) {
        deck.push(new Card(suit, rank));
      }
    }

    // "Shuffle" deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
}

export default Deck;
