import Card from "../components/Card.jsx";
import PlayerArea from "../components/PlayerArea.jsx";
import CommonArea from "../components/CommonArea.jsx";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext.jsx";

function Game() {
  const { lobbyID } = useParams();
  const { socket } = useSocket();

  const handleStartGame = () => {
    socket.emit("startGame", lobbyID);
  };

  return (
    <>
      <h3>Game: {lobbyID}</h3>

      <button onClick={handleStartGame}>Start Game</button>

      <CommonArea />

      <PlayerArea corner="tm">
        <Card rank={5} suit={"diamonds"} />
      </PlayerArea>
      <PlayerArea corner="bm">
        <Card rank={2} suit={"clubs"} />
      </PlayerArea>
    </>
  );
}

export default Game;
