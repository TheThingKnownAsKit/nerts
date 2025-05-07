import { DrawPile, NertsPile, BuildPile } from "./piles.js";

// Nerts-specific hand object and utilities
class Hand {
    constructor(numNertsCards = 3, numBuildPiles = 4) {
        this.nertsPile = new NertsPile();
        this.buildPiles = [];
        this.drawPile = new DrawPile();

        this.initializePiles(numNertsCards, numBuildPiles);
    }

    // Fill piles from unique shuffled deck
    initializePiles(numNertsCards, numBuildPiles) {
        const deck = new Deck(); // Creates shuffled deck

        this.nertsPile.initializePile(deck.cards.splice(0, numNertsCards)); // Create nerts pile

        // For each build pile, deal a card to it from the deck
        for (let i = 0; i < numBuildPiles; i++) {
            this.buildPiles.push(new BuildPile([deck.cards.pop()]));
        }

        this.drawPile.initializePile(deck.cards.splice(0)); // Deal rest of deck to draw pile
    }
}

// Defines card values and creates a full shuffled deck
class Deck {
    constructor() {
        this.suits = ["hearts", "diamonds", "clubs", "spades"];
        this.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        this.cards = this.createRandomDeck();
    }

    // Generates a random, 52-card deck
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

// Card object definition
class Card {
    constructor(suit, rank) {
        this.suit = suit; // "hearts", "diamonds", "clubs", "spades"
        this.rank = rank; // 1-13
        this.isRed = suit == "diamonds" || suit == "hearts"; // true, false
    }

    toString() {
        return `${this.rank}-${this.suit}`;
    }
}

export { Card, Deck, Hand };
