import "./Card.css";

const Card = ({ suit, rank, faceDown, onClick }) => {
  const src = faceDown
    ? "/cards/Back.png"
    : `/cards/${rank}_${suit}.png`;

  return (
    <img
      className="card"
      src={src}
      alt={faceDown ? "Card back" : `Card ${rank} of ${suit}`}
      onClick={onClick}
    />
  );
};

export default Card;