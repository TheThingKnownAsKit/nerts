import "./CommonArea.css";
import Card from "./Card";
import React, { useEffect, useRef } from "react";

// Sounds
import soundManager from "../logic/soundManager.js";
import play from "../assets/sounds/play.mp3";

/**
 * CommonArea component displays the foundation piles where all players can
 * play cards. It also plays a sound whenever a new card is added to any foundation pile.
 */
function CommonArea({ numberOfPlayers, foundation, onPlaySpotClick }) {
  const totalSpots = numberOfPlayers * 4;

  soundManager.loadSound("play", play);

  const prevFoundationRef = useRef(foundation);
  useEffect(() => {
    const prevFoundation = prevFoundationRef.current;

    if (prevFoundation) {
      foundation?.forEach((pile, index) => {
        const prevPile = prevFoundation[index];
        const prevLength = prevPile?.cards?.length ?? 0;
        const currentLength = pile?.cards?.length ?? 0;

        if (currentLength > prevLength) {
          soundManager.playSound("play");
        }
      });
    }

    prevFoundationRef.current = foundation;
  }, [foundation]);

  return (
    <div className="common-area">
      {Array.from({ length: totalSpots }).map((_, index) => {
        const pile = foundation?.[index];
        const topCard = pile?.cards?.[pile.cards.length - 1];

        return (
          <div
            key={index}
            className="play-spot"
            data-index={index}
            onClick={() => onPlaySpotClick(index, null)} // null or "common"
          >
            {topCard ? (
              <Card
                suit={topCard.suit}
                rank={topCard.rank}
                faceDown={false}
                locked={true}
                onClick={null} // These aren't clickable directly
                playerid={-1}
              />
            ) : (
              ``
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CommonArea;
