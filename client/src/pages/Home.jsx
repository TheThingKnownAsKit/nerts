import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters"
import './Home.css';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="main centered">
            <Letters/>
            <h1 onClick={() => navigate("/game")} tabindex="0">PLAY</h1>
            <h2 onClick={() => navigate("/rules")} tabindex="0">RULES</h2>
            <h2 onClick={() => navigate("/settings")} tabindex="0">SETTINGS</h2>
        </div>
    );
}

export default Home;