import { useNavigate } from "react-router-dom";
import Letters from "../components/Letters";
import './Landing.css';

function Landing() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/home");
    };

    return (
        <div className="main centered">
            <Letters/>
            <div id="login-signup">
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </div>
    );
}

export default Landing;