import Card from '../components/Card.jsx';

function Game() {
    return (
        <div>
            <h3>Game</h3>
            <Card rank={1} suit={"hearts"}/>
            <Card rank={12} suit={"spades"}/>
        </div>
    );
}

export default Game;