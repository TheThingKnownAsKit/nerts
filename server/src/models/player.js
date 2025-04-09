class Player {
  constructor(playerId, hand = null, score = 0) {
    this.playerId = playerId;
    this.hand = hand;
    this.score = score;
  }
}

export default Player;
