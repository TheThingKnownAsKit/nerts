import Card from "./Card";
import "./PlayerArea.css";

function PlayerArea({ corner, playerId, hand, userID, onPlaySpotClick, onCardClick, flippedCard }) {
  const isCurrentPlayer = playerId === userID;

  const renderNertsPile = () => {
    const pile = hand?.nertsPile?.cards || [];
    return pile.map((card, index) => (
      <Card
        key={`nerts-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== pile.length - 1}
        locked={false}
        style={{ '--i': index }}
        onClick={isCurrentPlayer ? () => onCardClick(card) : undefined}
      />
    ));
  };

  const renderWorkPile = (index) => {
    const pile = hand?.buildPiles?.[index]?.cards || [];
    return pile.map((card, i) => (
      <Card
        key={`work-${index}-${i}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={false}
        locked={false}
        style={{ '--i': i }}
        onClick={isCurrentPlayer ? () => onCardClick(card) : undefined}
      />
    ));
  };

  const renderStockPile = () => {
    const pile = hand?.drawPile?.cards || [];
    const visibleIndex = hand?.drawPile?.currentIndex;
    return pile.map((card, index) => (
      <Card
        key={`stock-${index}`}
        suit={card.suit}
        rank={card.rank}
        locked={false}
        faceDown={index !== visibleIndex}
        onClick={isCurrentPlayer ? () => onCardClick(card) : undefined}
      />
    ));
  };

  return (
    <div className={`player-area ${corner}`}>
      {/* Column 1: Nerts + Stock */}
      <div className="left-column">
        <div className="nerts-pile dashed-outline">{renderNertsPile()}</div>
        <div className="stock-pile dashed-outline">
          <div className="stock">
            {renderStockPile()}
          </div>
          <div className="flipped">
            {flippedCard && (
              <Card
                suit={flippedCard.suit}
                rank={flippedCard.rank}
                faceDown={false}
                locked={false}
                onClick={onCardClick ? () => onCardClick(flippedCard, false) : undefined}
              />
            )}
          </div>
        </div>
      </div>
  
      {/* Column 2: Work pile */}
      <div className="middle-column">
        <div className="work-pile dashed-outline">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="work-spot"
              data-index={index}
              data-playerid={playerId}
              onClick={() => onPlaySpotClick(index, playerId)}
            >
              {renderWorkPile(index) ?? `Work Spot ${index}`}
            </div>
          ))}
        </div>
      </div>
  
      {/* Column 3: Profile */}
      <div className="right-column">
        <div className="profile-info">Profile</div>
      </div>
    </div>
  );
}

export default PlayerArea;
