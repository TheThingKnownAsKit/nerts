import "./Card.css";

const Card = ({ suit, rank, faceDown, onClick, locked = false, style }) => {
  const src = faceDown
    ? "/cards/Back.png"
    : `/cards/${rank}_${suit}.png`;

  return (
    <img
      className={`card ${locked ? "locked" : "unlocked"}`}
      src={src}
      alt={faceDown ? "Card back" : `Card ${rank} of ${suit}`}
      onClick={locked ? undefined : onClick} // Disable interaction if locked
      style={style} // Passes the custom style (like --i) to the <img>
    />
  );
};

export default Card;