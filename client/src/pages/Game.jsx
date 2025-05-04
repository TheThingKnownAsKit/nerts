import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useEffect, useState } from "react";
import Popup from "../components/Popup.jsx";
import CustomButton from "../components/CustomButton.jsx";
import "./Game.css";

// Sounds
import soundManager from "../logic/soundManager.js";
import flips from "../assets/sounds/flip_cards.mp3";
import flip_one from "../assets/sounds/flip_card.mp3";

function Game() {
  const { lobbyID } = useParams();
  const { socket, gameState, userID } = useSocket();
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [popup, setPopup] = useState(null);
  const [playerCount, setPlayerCount] = useState(2);

  soundManager.loadSound("flips", flips);
  soundManager.loadSound("flip_one", flip_one);
  function playFlips() {
    soundManager.playSound("flips");
  }
  function playPlay() {
    soundManager.playSound("flip_one");
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
      socket.emit("startGame", lobbyID, playerCount);
    }
  };

  useEffect(() => {
    if (!socket) return;
  
    const handleGameStarted = ({ gameState }) => {
      setGameStarted(true);
    };
  
    const handleCardPlayAccepted = (moveWasMade) => {
      console.log(moveWasMade);
      if (moveWasMade) {
        playPlay();
      }
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

  const handleCardClick = (card, stockCard = true, playerId) => {
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
    const cardSelector = `[data-suit="${card.suit}"][data-rank="${card.rank}"][data-playerid="${playerId}"]`;
  
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
    if (!gameStarted) {
      // BEFORE game starts — show placeholders based on selected playerCount
      const layoutMap =
        playerCount === 1
          ? [{ id: "Player1", corner: "bm" }]
          : playerCount === 2
          ? [
              { id: "Player1", corner: "bm" },
              { id: "Player2", corner: "tm" },
            ]
          : playerCount === 3
          ? [
              { id: "Player1", corner: "bm" },
              { id: "Player2", corner: "tl" },
              { id: "Player3", corner: "tr" },
            ]
          : [
              { id: "Player1", corner: "tl" },
              { id: "Player2", corner: "tr" },
              { id: "Player3", corner: "bl" },
              { id: "Player4", corner: "br" },
            ];
  
      return layoutMap.map(({ id, corner }) => (
        <PlayerArea
          key={id}
          corner={corner}
          playerId={id}
          hand={null}
          userID={userID}
          onPlaySpotClick={() => {}}
          onCardClick={() => {}}
        />
      ));
    } else {
      // AFTER game starts — use real player IDs from backend
      const gs = gameState?.gameState;
      if (!gs || !gs.players) return null;
  
      const allPlayerIDs = Object.keys(gs.players);
      const otherPlayerIDs = allPlayerIDs.filter((id) => id !== userID);
  
      let layoutMap = [];
  
      if (allPlayerIDs.length === 1) {
        layoutMap = [{ id: userID, corner: "bm" }];
      } else if (allPlayerIDs.length === 2) {
        layoutMap = [
          { id: userID, corner: "bm" },
          { id: otherPlayerIDs[0], corner: "tm" },
        ];
      } else if (allPlayerIDs.length === 3) {
        layoutMap = [
          { id: userID, corner: "bm" },
          { id: otherPlayerIDs[0], corner: "tl" },
          { id: otherPlayerIDs[1], corner: "tr" },
        ];
      } else if (allPlayerIDs.length === 4) {
        layoutMap = [
          { id: otherPlayerIDs[0], corner: "tl" },
          { id: otherPlayerIDs[1], corner: "tr" },
          { id: otherPlayerIDs[2], corner: "bl" },
          { id: userID, corner: "br" },
        ];
      }
  
      return layoutMap.map(({ id, corner }) => (
        <PlayerArea
          key={id}
          corner={corner}
          playerId={id}
          hand={gs.players[id]?.hand}
          userID={userID}
          onPlaySpotClick={id === userID ? handlePlaySpotClick : () => {}}
          onCardClick={id === userID ? handleCardClick : () => {}}
        />
      ));
    }
  }
  

  return (
    <div className="game-container">

      {!gameStarted && (
        <div className="menu">
          <h3>Game: {lobbyID}</h3>
          <label className="player-count" htmlFor="player-count">Number of Players:</label>
          <select
            id="player-count"
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            className="player-count-selector"
          >
            {[2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <CustomButton onClick={startButtonPress} text="Start Game" />
        </div>
      )}

      <CommonArea
        numberOfPlayers={playerCount}
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
