import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useEffect, useState } from "react";
import Popup from "../components/Popup.jsx";

function Game() {
  const { lobbyID } = useParams();
  const { socket, gameState, userID } = useSocket();
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
    }
  };

  useEffect(() => {
    if (!socket) return;
  
    const handleGameStarted = ({ gameState }) => {
      setGameStarted(true);
    };
  
    socket.on("gameStarted", handleGameStarted);
  
    return () => {
      socket.off("gameStarted", handleGameStarted);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
  
    const handleCardPlayAccepted = (moveWasMade) => {
      console.log(moveWasMade);
    };
  
    socket.on("cardPlayAccepted", handleCardPlayAccepted);
  
    return () => {
      socket.off("cardPlayAccepted", handleCardPlayAccepted); //  Cleanup
    };
  }, [socket]);

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
        pile: {
          name: `buildPile`,
          index: spotIndex
        }
      },
      playerId: userID,
      gameId: lobbyID
    };
  
    console.log(payload);
    socket.emit("cardPlayed", payload);

    setSelectedCard(null);
  };

  function createCards() {
    const gs = gameState?.gameState;
    if (!gs || !gs.players) return null;

    const playerIDs = Object.keys(gs.players);
    const currentPlayerID = userID; // This is you
    const opponentID = playerIDs.find((id) => id !== userID); // Anyone else

    return (
      <>
        <PlayerArea
          corner="tm"
          nertsPile={renderNertsPile(opponentID)}
          workPile={renderWorkPiles(opponentID)}
          stockPile={renderStockPile(opponentID)}
          onPlaySpotClick={handlePlaySpotClick}
          playerId={opponentID}
        />

        <PlayerArea
          corner="bm"
          nertsPile={renderNertsPile(currentPlayerID)}
          workPile={renderWorkPiles(currentPlayerID)}
          stockPile={renderStockPile(currentPlayerID)}
          onPlaySpotClick={handlePlaySpotClick}
          playerId={currentPlayerID}
        />
      </>
    );
  }

  const renderNertsPile = (playerID) => {
    const pile =
      gameState?.gameState?.players?.[playerID]?.hand?.nertsPile?.cards;
    if (!pile) return null;
  
    const isCurrentPlayer = playerID === userID;
  
    return pile.map((card, index) => (
      <Card
        key={`${playerID}-nerts-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== pile.length - 1}
        onClick={isCurrentPlayer ? () => handleCardClick(card) : null}
      />
    ));
  };

  const renderWorkPiles = (playerID) => {
    const buildPiles =
      gameState?.gameState?.players?.[playerID]?.hand?.buildPiles;
    if (!buildPiles) return [];
  
    const isCurrentPlayer = playerID === userID;
  
    // Each work pile gets its own array of cards
    return buildPiles.map((pile, pileIndex) => {
      const cards = pile?.cards || [];
      const topCard = cards[cards.length - 1]; // Only show the top card
  
      if (!topCard) return null;
  
      return (
        <Card
          key={`${playerID}-work-${pileIndex}`}
          suit={topCard.suit}
          rank={topCard.rank}
          faceDown={false}
          onClick={isCurrentPlayer ? () => handleCardClick(topCard) : null}
        />
      );
    });
  };
  

  const renderStockPile = (playerID) => {
    const drawPile = gameState?.gameState?.players?.[playerID]?.hand?.drawPile;
    const cards = drawPile?.cards;
    const visibleIndex = drawPile?.currentIndex;

    if (!cards || visibleIndex === undefined) return null;

    const isCurrentPlayer = playerID === userID;

    return cards.map((card, index) => (
      <Card
        key={`${playerID}-stock-${index}`}
        suit={card.suit}
        rank={card.rank}
        faceDown={index !== visibleIndex}
        onClick={isCurrentPlayer ? () => handleCardClick(card) : null}
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
