import Card from "./Card";
import "./PlayerArea.css";
import nertsButton from "../assets/images/nerts_button.png";

function PlayerArea({
  corner,
  playerId,
  hand,
  userID,
  onPlaySpotClick,
  onCardClick,
  handleNerts
}) {
  const isCurrentPlayer = playerId === userID;

  const renderNertsPile = () => {
    const pile = hand?.nertsPile?.cards || [];
    return pile.map((card, index) => (
      <Card
        key={`nerts-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== pile.length - 1}
        locked={index !== pile.length - 1 || !isCurrentPlayer}
        style={{ "--i": index }}
        onClick={
          onCardClick ? () => onCardClick(card, true, playerId) : undefined
        }
        playerid={playerId}
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
        locked={false || !isCurrentPlayer}
        style={{ "--i": i }}
        onClick={
          onCardClick ? () => onCardClick(card, true, playerId) : undefined
        }
        playerid={playerId}
      />
    ));
  };
  const renderStockPile = () => {
    const pile = hand?.drawPile?.cards || [];
    const visibleIndex = hand?.drawPile?.currentIndex ?? -1;

    return pile.map((card, index) => {
      // Skip rendering the visible (flipped) card
      if (index === visibleIndex) return null;

      return (
        <Card
          key={`stock-${index}`}
          suit={card.suit}
          rank={card.rank}
          faceDown={true}
          locked={false || !isCurrentPlayer}
          onClick={
            onCardClick ? () => onCardClick(card, true, playerId) : undefined
          }
          playerid={playerId}
        />
      );
    });
  };

  return (
    <div className={`player-area ${corner}`}>
      {/* Column 1: Nerts + Stock */}
      <div className="left-column">
      <div className="nerts-pile dashed-outline">
        {renderNertsPile()}
        {hand?.nertsPile?.cards?.length !== 0 && (
          <img className="nerts-button" src={nertsButton} alt="nerts button" onClick={handleNerts}/>
        )}
      </div>
        <div className="stock-pile dashed-outline">
          <div className="stock">{renderStockPile()}</div>
          <div className="flipped">
            {(() => {
              const visibleIndex = hand?.drawPile?.currentIndex ?? -1;
              const card = hand?.drawPile?.cards?.[visibleIndex];

              return card ? (
                <Card
                  key={`flipped-${card.rank}-${card.suit}`}
                  suit={card.suit}
                  rank={card.rank}
                  faceDown={false}
                  locked={false || !isCurrentPlayer}
                  onClick={
                    onCardClick
                      ? () => onCardClick(card, false, playerId)
                      : undefined
                  }
                  playerid={playerId}
                />
              ) : null;
            })()}
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
