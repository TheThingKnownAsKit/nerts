import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import "./Rules.css";

function Rules() {
  const navigate = useNavigate();

  return (
    <div className="rules-container">
      <CustomButton back={true} absolute={true} text={"Back"} />
      <div className="rules-top-right">
        <p>
          Clicking your deck will flip 3 new cards at a time. Keep moving cards
          until you run out or your Nerts pile is empty.
        </p>
        <p>
          Once you’ve cleared your Nerts pile, call “Nerts!” to end the round.
          Points are tallied based on cards you played in the foundation minus
          leftover cards in your Nerts pile.
        </p>
      </div>
      <div className="rules-bottom-left">
        <p>
          To win the game, be the first to reach 100 points. Cards of the same
          suit in the foundation are worth 1 point each.
        </p>
        <p>
          When you've moved all your cards to the middle as possible, you can
          click your deck to flip 3 cards into your waste pile. From there, move
          them to your tableau or foundation as needed.
        </p>
      </div>
    </div>
  );
}

export default Rules;
