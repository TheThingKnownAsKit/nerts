import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";

function Game() {
  const { lobbyID } = useParams();
  const { socket, gameState } = useSocket();

  const handleStartGame = () => {
    socket.emit("startGame", lobbyID);
  };

  // Render game state if it exists
  const renderGameState = () => {
    if (!gameState?.gameState || !gameState.gameState.hands) return null;
    
    const gs = gameState.gameState;
    
    const playerIDs = Object.keys(gs.hands);
    const currentPlayerID = playerIDs[0];
    const opponentID = playerIDs[1];
    
    return (
      <>
        {/* Opponent's area */}
        <PlayerArea 
          corner="tm"
          nertsPile={renderNertsPile(opponentID)}
          workPile={renderWorkPiles(opponentID)}
          stockPile={renderStockPile(opponentID)}
        />
        
        {/* Current player's area */}
        <PlayerArea 
          corner="bm"
          nertsPile={renderNertsPile(currentPlayerID)}
          workPile={renderWorkPiles(currentPlayerID)}
          stockPile={renderStockPile(currentPlayerID)}
        />
      </>
    );
  };
  
  const renderNertsPile = (playerID) => {
    if (!gameState?.gameState?.hands?.[playerID]?.nertsPile) return null;
    
    return gameState.gameState.hands[playerID].nertsPile.map((card, index) => (
      <Card key={`${playerID}-nerts-${index}`} suit={card.suit} rank={card.rank} />
    ));
  };
  
  const renderWorkPiles = (playerID) => {
    if (!gameState?.gameState?.hands?.[playerID]?.buildPiles) return null;
    
    const workCards = [];
    
    for (let i = 0; i < gameState.gameState.hands[playerID].buildPiles.length; i++) {
      const pile = gameState.gameState.hands[playerID].buildPiles[i];
      pile.forEach((card, cardIndex) => {
        workCards.push(
          <Card 
            key={`${playerID}-work-${i}-${cardIndex}`} 
            suit={card.suit} 
            rank={card.rank} 
          />
        );
      });
    }
    
    return workCards;
  };
  
  // Render the stock pile
  const renderStockPile = (playerID) => {
    if (!gameState?.gameState?.hands?.[playerID]?.drawPile) return null;
    
    return gameState.gameState.hands[playerID].drawPile.map((card, index) => (
      <Card key={`${playerID}-stock-${index}`} suit={card.suit} rank={card.rank} />
    ));
  };

  return (
    <>
      <h3>Game: {lobbyID}</h3>
      <button onClick={handleStartGame}>Start Game</button>
      <CommonArea gameState={gameState} />
      
      {gameState ? renderGameState() : (
        <>
          <PlayerArea corner="tm" />
          <PlayerArea corner="bm" />
        </>
      )}
    </>
  );
}

export default Game;