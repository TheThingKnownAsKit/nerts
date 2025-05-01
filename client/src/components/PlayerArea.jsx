import "./PlayerArea.css";

function PlayerArea({ corner, nertsPile, workPile, stockPile, onPlaySpotClick, playerId }) {
  return (
    <div className={`player-area ${corner}`}>
      <div className="top-row">
        <div className="nerts-pile dashed-outline">{nertsPile}</div>
        <div className="work-pile dashed-outline">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="work-spot"
              data-index={index}
              data-playerid={playerId}
              onClick={() => onPlaySpotClick(index, playerId)}
              >
              {workPile?.[index] ?? `Work Spot ${index}`}
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-row">
        <div className="stock-pile dashed-outline">{stockPile}</div>
        <div className="profile-info">Profile</div>
      </div>
    </div>
  );
}

export default PlayerArea;
