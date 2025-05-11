import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";
import { useEffect, useState } from "react";
import Popup from "../components/Popup.jsx";
import CustomButton from "../components/CustomButton.jsx";
import RoundDisplay from "../components/RoundDisplay.jsx";
import "./Game.css";
import { db } from "../firebase/config";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Sounds
import soundManager from "../logic/soundManager.js";
import flips from "../assets/sounds/flip_cards.mp3";
import flip_one from "../assets/sounds/flip_card.mp3";

function Game() {
  const navigate = useNavigate();
  const { lobbyID } = useParams();
  
  const { socket, gameState, userID, host } = useSocket(); // Need this for database stuff
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [popup, setPopup] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [playerList, setPlayerList] = useState({});
  const [seconds, setSeconds] = useState(10);

  const [round, setRound] = useState(1);
  const [roundEnded, setRoundEnded] = useState(false);
  const [gameEnded, setGameEnded] = useState("no");

  const fetchUsername = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().username : "Anonymous";
  };

  const goToHome = () => {
    socket.emit("leftLobby", { userID, lobbyID });
    navigate("/home");
  };

  const goToRules = () => {
    navigate("/rules");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("lobbyUpdated", async ({ players: uids }) => {
      const entries = await Promise.all(
        uids.map(async (uid) => {
          const username = await fetchUsername(uid);
          return [uid, username];
        })
      );
      setPlayerList(Object.fromEntries(entries));
    });

    socket.on("playerJoined", async ({ playerID: uid }) => {
      const username = await fetchUsername(uid);
      setPopup({
        title: "Player Joined",
        message: `${username} has joined the lobby!`,
      });
    });

    return () => {
      socket.off("lobbyUpdated");
      socket.off("playerJoined");
    };
  }, [socket]);

  const currentPlayerCount = Object.keys(gameState?.players || {}).length || 0;
  useEffect(() => {
    setPlayerCount(currentPlayerCount);
  }, [currentPlayerCount]);

  soundManager.loadSound("flips", flips);
  soundManager.loadSound("flip_one", flip_one);
  function playFlips() {
    soundManager.playSound("flips");
  }
  function playPlay() {
    soundManager.playSound("flip_one");
  }

  const startButtonPress = () => {
    if (socket) {
      socket.emit("startGame", lobbyID);
    }
  };

  const handleNerts = () => {
    const payload = {
      playerId: userID,
      lobbyId: lobbyID,
    };

    // Update the number of nerts called in user statistics
    const statsRef = doc(db, "users", userID, "statistics", "data");
    updateDoc(statsRef, { nerts_called: increment(1) });

    socket.emit("callNerts", payload);
  };

  useEffect(() => {
    if (!socket) return;

    const handleGameStarted = ({ gameState }) => {
      setGameStarted(true);
    };

    const handleshuffleWarning = () => {
      setSeconds(10); // initialize countdown
      const warningEl = document.querySelector(".shuffle-warning");
      if (warningEl) {
        warningEl.classList.remove("hidden");
      }

      const interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearInterval(interval);
            removeAllCardSelections();
            playFlips();

            if (warningEl) {
              warningEl.classList.add("hidden");
            }
          }
          return next;
        });
      }, 1000);
    };

    const handleCardPlayAccepted = (moveWasMade) => {
      if (moveWasMade) {
        // Update the number of cards played in user statistics
        const statsRef = doc(db, "users", userID, "statistics", "data");
        updateDoc(statsRef, { cards_played: increment(1) });

        playPlay();
      }
    };

    const handleNewDrawCard = () => {
      playFlips();
    };

    const handleEndRound = () => {
      setRoundEnded(true);
    };

    const handleRoundStarted = () => {
      setRoundEnded(false);
      setRound((prevRound) => prevRound + 1);
      playFlips();
    };

    const handleEndGame = () => {
      // Update the number of games played in user statistics
      const statsRef = doc(db, "users", userID, "statistics", "data");
      updateDoc(statsRef, { gamesPlayed: increment(1) });

      setRoundEnded(true);
      setGameEnded("won");
    };

    socket.on("gameStarted", handleGameStarted);
    socket.on("cardPlayAccepted", handleCardPlayAccepted);
    socket.on("newDrawCard", handleNewDrawCard);
    socket.on("shuffleWarning", handleshuffleWarning);
    socket.on("endRound", handleEndRound);
    socket.on("roundStarted", handleRoundStarted);
    socket.on("endGame", handleEndGame);

    return () => {
      socket.off("gameStarted", handleGameStarted);
      socket.off("cardPlayAccepted", handleCardPlayAccepted);
      socket.off("newDrawCard", handleNewDrawCard);
      socket.off("shuffleWarning", handleshuffleWarning);
      socket.off("endRound", handleEndRound);
      socket.off("endGame", handleEndGame);
    };
  }, [socket]);

  function removeAllCardSelections() {
    document
      .querySelectorAll(".card.selected")
      .forEach((el) => el.classList.remove("selected"));
  }

  const nextRoundPress = () => {
    setRoundEnded(false);
  };

  const handleCardClick = (card, stockCard = true, playerId) => {
    const drawPile = gameState?.players?.[userID]?.hand?.drawPile;
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
    } else {
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
      lobbyId: lobbyID,
    };

    socket.emit("cardPlayed", payload);
    setSelectedCard(null);
  };

  function createCards() {
    if (!gameState || !gameState.players) return null;

    const allPlayerIDs = Object.keys(gameState.players);
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
        hand={gameState.players[id]?.hand}
        userID={userID}
        onPlaySpotClick={id === userID ? handlePlaySpotClick : () => {}}
        onCardClick={id === userID ? handleCardClick : () => {}}
        handleNerts={handleNerts}
      />
    ));
  }

  return (
    <div className="game-container">
      <CustomButton absolute className="left" text="Exit" onClick={goToHome} />
      <div
        className="help-button"
        onClick={goToRules}
        title="View Rules"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") goToRules();
        }}
      >
        ?
      </div>

      {!gameStarted && (
        <>
          <div className="menu">
            <h3>Game: {lobbyID}</h3>
            <label className="player-count" htmlFor="player-count">
              Invite up to 4 players to join your game!
            </label>

            {userID === host && (
              <CustomButton onClick={startButtonPress} text="Start Game" />
            )}
          </div>
          <div className="player-list">
            <h3>Players:</h3>
            <ul className="player-name-container">
              {Object.entries(playerList).map(([id, username], index) => (
                <li
                  key={id}
                  className="player-name"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {username}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {gameStarted && (
        <>
          <CommonArea
            numberOfPlayers={currentPlayerCount}
            foundation={gameState?.foundation}
            onPlaySpotClick={handlePlaySpotClick}
          />
          <div className="shuffle-warning hidden">
            DRAW PILES WILL BE SHUFFLED IN {seconds} SECONDS DUE TO INACTIVITY
          </div>
        </>
      )}
      {gameStarted && <>{createCards()}</>}
      {roundEnded && (
        <>
          <RoundDisplay
            round={round}
            playerList={playerList}
            lobbyID={lobbyID}
            endGame={gameEnded}
          />
        </>
      )}
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
