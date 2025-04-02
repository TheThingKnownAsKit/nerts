import Deck from "./deck.js";

// Object that handles dealing a users hand
class Hand {
  constructor(numNertsCards = 13, numBuildPiles = 4) {
    this.nertsPile = [];
    this.buildPiles = [];
    this.drawPile = [];

    this.initializePiles(numNertsCards, numBuildPiles);
  }

  // Fill piles from unique shuffled deck
  initializePiles(numNertsCards, numBuildPiles) {
    // Creates shuffled deck
    const deck = new Deck();

    // Put specified number of nerts cards in nerts pile from deck
    this.nertsPile = deck.cards.splice(0, numNertsCards);

    // For each build pile, deal a card to it from the deck
    for (let i = 0; i < numBuildPiles; i++) {
      this.buildPiles.push([deck.cards.pop()]);
    }

    // Deal the remaining deck cards to the draw pile
    this.drawPile = deck.cards.splice(0);
  }
}

export default Hand;
