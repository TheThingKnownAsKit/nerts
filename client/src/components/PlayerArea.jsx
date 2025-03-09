import "./PlayerArea.css";

function PlayerArea({ corner, children }) {
  return (
    <div className={`player-area ${corner}`}>
      <div className="top-row">
        <div className="nerts-pile dashed-outline"></div>
        <div className="play-pile dashed-outline">{children}</div>
      </div>
      <div className="bottom-row">
        <div className="stock-pile dashed-outline"></div>
        <div className="profile-info">Profile</div>
      </div>
    </div>
  );
}

export default PlayerArea;
