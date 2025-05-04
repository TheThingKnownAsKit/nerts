import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useEffect, useState } from "react";
import Popup from "../components/Popup.jsx";

// Sounds
import soundManager from "../logic/soundManager.js";
import flips from "../assets/sounds/flip_cards.mp3";

function Game() {
  const { lobbyID } = useParams();
  const { socket, gameState, userID } = useSocket();
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [popup, setPopup] = useState(null);

  soundManager.loadSound("flips", flips);
  function playFlips() {
    soundManager.playSound("flips");
  }

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
  
    const handleCardPlayAccepted = (moveWasMade) => {
      console.log(moveWasMade);
    };

    const handleNewDrawCard = () => {
      playFlips();
    };
  
    socket.on("gameStarted", handleGameStarted);
    socket.on("cardPlayAccepted", handleCardPlayAccepted);
    socket.on("newDrawCard", handleNewDrawCard);

    return () => {
      socket.off("gameStarted", handleGameStarted);
      socket.off("cardPlayAccepted", handleCardPlayAccepted);
      socket.off("newDrawCard", handleNewDrawCard);
    };
  }, [socket]);


  function removeAllCardSelections() {
    document.querySelectorAll(".card.selected").forEach((el) =>
      el.classList.remove("selected")
    );
  }

  const handleCardClick = (card, stockCard = true) => {
    const drawPile = gameState?.gameState?.players?.[userID]?.hand?.drawPile;
    const visibleIndex = drawPile?.currentIndex ?? -1;
    const visibleCard = drawPile?.cards?.[visibleIndex];
  
    const isDrawPileCard = drawPile?.cards?.some(
      (c) => c.suit === card.suit && c.rank === card.rank
    );
  
    const isNotVisible =
      !visibleCard ||
      visibleCard.suit !== card.suit ||
      visibleCard.rank !== card.rank;
  
    if (stockCard && isDrawPileCard && isNotVisible) {
      socket.emit("flipDrawPile", {
        lobbyId: lobbyID,
        playerId: userID,
      });
      setSelectedCard(null);
      removeAllCardSelections();
      return;
    }
  
    // Toggle selection
    const cardSelector = `[data-suit="${card.suit}"][data-rank="${card.rank}"]`;
  
    // Clear all other selections
    removeAllCardSelections();
  
    if (
      selectedCard &&
      selectedCard.suit === card.suit &&
      selectedCard.rank === card.rank
    ) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
  
      // Add the selected class
      const el = document.querySelector(cardSelector);
      if (el) el.classList.add("selected");
    }
  };

  const handlePlaySpotClick = (spotIndex, clickedPlayerId) => {
    if (!selectedCard || !socket) return;
  
    removeAllCardSelections();

    let destinationPileName;
    let destinationPileIndex;
  
    if (!clickedPlayerId || clickedPlayerId !== userID) {
      destinationPileName = "foundationPile";
      destinationPileIndex = spotIndex;
    }else {
      // It's a foundation pile in the common area
      destinationPileName = "buildPile";
      destinationPileIndex = spotIndex;
    }
  
    const payload = {
      source: {
        card: {
          suit: selectedCard.suit,
          rank: selectedCard.rank,
        },
      },
      destination: {
        pile: {
          name: destinationPileName,
          index: destinationPileIndex,
        },
      },
      playerId: userID,
      gameId: lobbyID,
    };
  
    console.log("Sending payload:", payload);
    socket.emit("cardPlayed", payload);
    setSelectedCard(null);
    console.log(gameState);
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
          corner="bm"
          playerId={currentPlayerID}
          hand={gameState?.gameState?.players?.[currentPlayerID]?.hand}
          userID={userID}
          onPlaySpotClick={handlePlaySpotClick}
          onCardClick={handleCardClick}
          />
        <PlayerArea
          corner="tm"
          playerId={opponentID}
          hand={gameState?.gameState?.players?.[opponentID]?.hand}
          userID={userID}
          onPlaySpotClick={() => {}}
          onCardClick={() => {}}
          />
      </>
    );
  }

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
        foundation={gameState?.gameState?.foundation}
        onPlaySpotClick={handlePlaySpotClick}
      />

      {/* render the popup component
        - `title` and `message` come from the lobby socket handling
        - `onClose`hides the popup and sets to null
      */}
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
