// Nerts pile model
class NertsPile {
  constructor(cards = []) {
    this.cards = cards;
    this.name = "nertsPile";
  }

  // Create nerts pile given cards
  initializePile(cards) {
    this.cards = cards;
  }

  // Remove and return top card
  takeCard() {
    return this.cards.pop();
  }
}

// Draw pile model
class DrawPile {
  constructor(cards = []) {
    this.cards = cards;
    this.currentIndex = -1;
    this.name = "drawPile";
  }

  // Create draw pile
  initializePile(cards) {
    this.cards = cards;
  }

  // "Flips" the next three cards returning the new "visible" card
  flip() {
    const cardsRemaining = this.cards.length - (this.currentIndex + 1); // Cards left relative to "visible" card

    if (cardsRemaining >= 3) {
      // If greater than 3 cards left, flip 3
      this.currentIndex += 3;
    } else if (cardsRemaining > 0) {
      // If less than 3 cards left, flip to last
      this.currentIndex = this.cards.length - 1;
    } else if (cardsRemaining == 0) {
      // If at the last card, reset pile
      this.currentIndex = -1;
    }
    return this.cards[this.currentIndex];
  }

  // Remove and return currently "visible" card
  takeCard() {
    return this.cards.splice(this.currentIndex, 1);
  }
}

// Build pile model
class BuildPile {
  constructor(cards = []) {
    this.cards = cards;
    this.name = "buildPile";
  }

  // Create build pile
  initializePile(cards) {
    this.cards = cards;
  }

  // Remove and return sub-stack of pile from a given index
  takeCards(index) {
    if (index == -1) {
      index = this.cards.length - 1;
    }
    return this.cards.splice(index);
  }

  // Add card(s) to pile
  addCards(cards) {
    if (this.cards.length == 0) {
      // If no cards in pile, place all cards
      cards.forEach((card) => {
        this.cards.push(card);
      });
    } else if (
      this.cards.at(-1).rank == cards[0].rank + 1 &&
      this.cards.at(-1).isRed != cards[0].isRed
    ) {
      // Make sure top-most card is arithmetically below end of pile and an alternate color
      cards.forEach((card) => {
        this.cards.push(card);
      });
    }
  }
}

// Foundation pile model
class FoundationPile {
  constructor() {
    this.cards = [];
    this.suit = null;
    this.name = "foundationPile";
  }

  // Try to add given card to top of pile
  addCard(card) {
    // Check if pile is empty
    if (this.cards.length == 0) {
      // Verify that card is an ace
      if (card.rank == 1) {
        // Add card and set pile suit
        this.cards.push(card);
        this.suit = card.suit;
      } else {
        throw new Error("Card must be an ace for an empty foundation pile.");
      }
    } else {
      // Check if card is arithmetically next and matches pile suit
      if ((card.rank = this.cards.at(-1).rank + 1) && card.suit == this.suit) {
        this.cards.push(card);
      } else {
        throw new Error(
          "Card is not arithmetically next or does not match suit of foundation pile."
        );
      }
    }
  }
}

export { NertsPile, DrawPile, BuildPile, FoundationPile };
