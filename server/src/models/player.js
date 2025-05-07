import { Hand } from "./hand.js";

class Player {
  constructor(playerId, score = 0) {
    this.playerId = playerId;
    this.hand = new Hand();
    this.visibleHand = {};
    this.score = score;

    this.updateVisibleHand();
  }

  // Initialize cards visible/playable to the player
  updateVisibleHand() {
    const visibleHand = {}; // Initialize dictionary where key is card string and value is card/pile info

    // Get the top nerts card and add to visible hand if not undefined
    const nertsCard = this.hand.nertsPile.seeCard();
    if (nertsCard) {
      visibleHand[nertsCard.toString()] = { pileName: "nertsPile" };
    }

    // Get visible draw card (if exists) and add to visible hand
    if (this.hand.drawPile.currentIndex != -1) {
      const drawCard = this.hand.drawPile.seeCard();
      if (drawCard) {
        visibleHand[drawCard.toString()] = { pileName: "drawPile" };
      }
    }

    // Loop through each build pile and pile card to add to visible hand
    for (
      let pileIndex = 0;
      pileIndex < this.hand.buildPiles.length;
      pileIndex++
    ) {
      for (
        let cardIndex = 0;
        cardIndex < this.hand.buildPiles[pileIndex].cards.length;
        cardIndex++
      ) {
        visibleHand[
          this.hand.buildPiles[pileIndex].cards[cardIndex].toString()
        ] = {
          pileName: "buildPile",
          pileIndex: pileIndex,
          cardIndex: cardIndex,
        };
      }
    }
    this.visibleHand = visibleHand;
    return visibleHand;
  }

  // Create a new hand for the player
  createNewHand() {
    this.hand = new Hand();
  }

  // Shuffles draw pile
  shuffleDrawPile() {
    this.hand.drawPile.shuffle();
  }
}

export default Player;
