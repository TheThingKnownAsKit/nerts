import "./CommonArea.css";
import Card from "./Card";

function CommonArea({ numberOfPlayers, foundation, onPlaySpotClick }) {
  const totalSpots = numberOfPlayers * 4;

  return (
    <div className="common-area">
      {Array.from({ length: totalSpots }).map((_, index) => {
        const pile = foundation?.[index];
        const topCard = pile?.cards?.[pile.cards.length - 1];

        return (
          <div
            key={index}
            className="play-spot"
            data-index={index}
            onClick={() => onPlaySpotClick(index, null)} // null or "common"
            >
            {topCard ? (
              <Card
                suit={topCard.suit}
                rank={topCard.rank}
                faceDown={false}
                onClick={null} // These aren't clickable directly
              />
            ) : (
              `Spot ${index}`
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CommonArea;
