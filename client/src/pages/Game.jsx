import Card from '../components/Card.jsx';
import PlayerArea from '../components/PlayerArea.jsx';

function Game() {
    return (
        <>
            <h3>Game</h3>

            <PlayerArea corner="tl" />
            <PlayerArea corner="tr" />
            <PlayerArea corner="bl" />
            <PlayerArea corner="br">
                <Card rank={12} suit={"spades"} />
                <Card rank={1} suit={"hearts"} />
                <Card rank={13} suit={"diamonds"} />
                <Card rank={2} suit={"clubs"} />
            </PlayerArea>
        </>
    );
}

export default Game;