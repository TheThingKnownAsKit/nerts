import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useEffect, useState } from "react";
import Popup from "../components/Popup.jsx";

function Game() {
  const { lobbyID } = useParams();
  const { socket, gameState } = useSocket();
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    socket.on("playerJoined", ({ message }) => {
      setPopup({
        title: "New Player Joined",
        message,
      });
    });
    return () => {
      socket.off("playerJoined");
    };
  }, [socket]);

  const startButtonPress = () => {
    if (socket) {
      socket.emit("startGame", lobbyID);
      setGameStarted(true); // Hide the button
    }
  };

  const handleCardClick = (card) => {
    if (
      selectedCard &&
      selectedCard.suit === card.suit &&
      selectedCard.rank === card.rank
    ) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const handlePlaySpotClick = (spotIndex) => {
    if (!selectedCard || !socket) return;

    const payload = {
      source: {
        card: {
          suit: selectedCard.suit,
          rank: selectedCard.rank,
        },
      },
      destination: {
        pileName: `buildPile${spotIndex}`,
      },
    };

    socket.emit("cardPlayed", payload);
    console.log(payload);
    setSelectedCard(null);
  };

  function createCards() {
    const gs = gameState?.gameState;
    if (!gs || !gs.players) return null;

    const playerIDs = Object.keys(gs.players);
    const currentPlayerID = playerIDs[0];
    const opponentID = playerIDs[1];

    return (
      <>
        <PlayerArea
          corner="tm"
          nertsPile={renderNertsPile(opponentID)}
          workPile={renderWorkPiles(opponentID)}
          stockPile={renderStockPile(opponentID)}
        />

        <PlayerArea
          corner="bm"
          nertsPile={renderNertsPile(currentPlayerID)}
          workPile={renderWorkPiles(currentPlayerID)}
          stockPile={renderStockPile(currentPlayerID)}
        />
      </>
    );
  }

  const renderNertsPile = (playerID) => {
    const pile =
      gameState?.gameState?.players?.[playerID]?.hand?.nertsPile?.cards;
    if (!pile) return null;

    return pile.map((card, index) => (
      <Card
        key={`${playerID}-nerts-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== pile.length - 1}
        onClick={() => handleCardClick(card)}
      />
    ));
  };

  const renderWorkPiles = (playerID) => {
    const buildPiles =
      gameState?.gameState?.players?.[playerID]?.hand?.buildPiles;
    if (!buildPiles) return null;

    const workCards = [];

    for (let i = 0; i < buildPiles.length; i++) {
      const pile = buildPiles[i]?.cards || [];
      pile.forEach((card, cardIndex) => {
        workCards.push(
          <Card
            key={`${playerID}-work-${i}-${cardIndex}`}
            suit={card.suit}
            rank={card.rank}
            faceDown={false}
            onClick={() => handleCardClick(card)}
          />
        );
      });
    }

    return workCards;
  };

  const renderStockPile = (playerID) => {
    const drawPile = gameState?.gameState?.players?.[playerID]?.hand?.drawPile;
    const cards = drawPile?.cards;
    const visibleIndex = drawPile?.currentIndex;

    if (!cards || visibleIndex === undefined) return null;

    return cards.map((card, index) => (
      <Card
        key={`${playerID}-stock-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== visibleIndex}
        onClick={() => handleCardClick(card)}
      />
    ));
  };

  const numberOfPlayers =
    Object.keys(gameState?.gameState?.players || {}).length || 2;

  return (
    <div className="game-container">
      <h3>Game: {lobbyID}</h3>

      {!gameStarted && (
        <button onClick={startButtonPress} className="start-game-button">
          Start Game
        </button>
      )}

      <CommonArea
        numberOfPlayers={numberOfPlayers}
        onPlaySpotClick={handlePlaySpotClick}
      />

      {createCards()}
      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

export default Game;
