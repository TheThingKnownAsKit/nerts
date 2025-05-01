import Card from "./Card";
import "./PlayerArea.css";

function PlayerArea({ corner, playerId, hand, userID, onPlaySpotClick, onCardClick }) {
  const isCurrentPlayer = playerId === userID;

  const renderNertsPile = () => {
    const pile = hand?.nertsPile?.cards || [];
    return pile.map((card, index) => (
      <Card
        key={`nerts-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== pile.length - 1}
        onClick={isCurrentPlayer ? () => onCardClick(card) : undefined}
      />
    ));
  };

  const renderWorkPile = (index) => {
    const pile = hand?.buildPiles?.[index]?.cards || [];
    const topCard = pile[pile.length - 1];
    return topCard ? (
      <Card
        suit={topCard.suit}
        rank={topCard.rank}
        faceDown={false}
        onClick={isCurrentPlayer ? () => onCardClick(topCard) : undefined}
      />
    ) : null;
  };

  const renderStockPile = () => {
    const pile = hand?.drawPile?.cards || [];
    const visibleIndex = hand?.drawPile?.currentIndex;
    return pile.map((card, index) => (
      <Card
        key={`stock-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== visibleIndex}
        onClick={isCurrentPlayer ? () => onCardClick(card) : undefined}
      />
    ));
  };

  return (
    <div className={`player-area ${corner}`}>
      <div className="top-row">
        <div className="nerts-pile dashed-outline">{renderNertsPile()}</div>
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
      <div className="bottom-row">
        <div className="stock-pile dashed-outline">{renderStockPile()}</div>
        <div className="profile-info">Profile</div>
      </div>
    </div>
  );
}

export default PlayerArea;
