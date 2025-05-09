import "./CustomButton.css";
import { useNavigate } from "react-router-dom";

// Sounds
import soundManager from "../logic/soundManager.js";
import click from "../assets/sounds/click.mp3";

const CustomButton = ({ onClick, text, absolute, back, className = "" }) => {
  const navigate = useNavigate();
  soundManager.loadSound("click", click);
  function playClick() {
    soundManager.playSound("click");
  }

  const handleBackClick = () => {
    navigate(-1); // Previous page
  };

  return (
    <>
      <div
        className={[
          "custom-button no-select",
          absolute && "absolute",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={back ? handleBackClick : onClick}
        onMouseEnter={playClick}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            {
              back ? handleBackClick() : onClick(e);
            }
          }
        }}
      >
        {text}
      </div>
    </>
  );
};

export default CustomButton;
