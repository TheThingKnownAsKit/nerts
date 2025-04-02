class Card {
  constructor(suit, rank) {
    this.suit = suit; // "hearts", "diamonds", "clubs", "spades"
    this.rank = rank; // 1-13
  }

  toString() {
    return `${this.rank} of ${this.suit}`;
  }
}

export default Card;
