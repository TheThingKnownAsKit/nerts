import "./CommonArea.css";

function CommonArea({ numberOfPlayers, onPlaySpotClick }) {
  const totalSpots = numberOfPlayers * 4;

  return (
    <div className="common-area">
      {Array.from({ length: totalSpots }).map((_, index) => (
        <div
          key={index}
          className="play-spot"
          data-index={index}
          onClick={() => onPlaySpotClick(index)}
        >
          Spot {index}
        </div>
      ))}
    </div>
  );
}

export default CommonArea;
