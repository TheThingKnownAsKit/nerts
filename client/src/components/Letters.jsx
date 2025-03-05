import React from "react";
import "./Letters.css";

const letters = ["N", "E", "R", "T", "S", "!"];

const Letters = () => {
    return (
        <div className="wiggle-container">
          {letters.map((letter, index) => (
            <img
              key={index}
              src={`/src/assets/letters/${letter}.png`}
              className="wiggle-letter"
              draggable="false"
              style={{ animationDelay: `${index * 0.2}s` }} // Offsets each letter
            />
          ))}
        </div>
      );
};

export default Letters;
