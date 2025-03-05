import { useNavigate } from "react-router-dom";
import './Landing.css';

// Images
import nertsLogo from "../assets/nerts.png";

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="main">
            <img src={nertsLogo} alt="Nerts logo" id="nerts-logo"/>
            <div id="login-signup">
                <button onClick={() => navigate("/login")}>Login</button>
                <button onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </div>
    );
}

export default Landing;