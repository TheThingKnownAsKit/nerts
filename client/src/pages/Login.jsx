import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/config';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user);
            navigate('/game');
        } catch (error) {
            console.error("Error logging in:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button
                onClick={handleLogin}
                disabled={isLoading}>
                {isLoading ? 'Logging up...' : 'Log in'}
            </button>
            <button
                onClick={() => navigate('/')}
                disabled={isLoading}>
                Back
            </button>
        </div>
    );
}

export default Login;
