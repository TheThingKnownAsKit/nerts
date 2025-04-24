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

    // Get the top nerts card and add to visible hand
    const nertsCard = this.hand.nertsPile.seeCard();
    visibleHand[nertsCard.toString()] = { pileName: "nertsPile" };

    if (this.hand.drawPile.currentIndex != -1) {
      const drawCard = this.hand.drawPile.seeCard();
      visibleHand[drawCard.toString()] = { pileName: "drawPile" };
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
  }
}

export default Player;
