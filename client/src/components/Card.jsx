import "./Card.css";

const Card = ({ suit, rank }) => {
  return (
    <>
      <img className="card" src={`/cards/${rank}_${suit}.png`} alt="Card" />
    </>
  );
};

export default Card;
