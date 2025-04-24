import "./PlayerArea.css";

function PlayerArea({ corner, nertsPile, workPile, stockPile }) {
  return (
    <div className={`player-area ${corner}`}>
      <div className="top-row">
        <div className="nerts-pile dashed-outline">{nertsPile}</div>
        <div className="work-pile dashed-outline">{workPile}</div>
      </div>
      <div className="bottom-row">
        <div className="stock-pile dashed-outline">{stockPile}</div>
        <div className="profile-info">Profile</div>
      </div>
    </div>
  );
}

export default PlayerArea;
