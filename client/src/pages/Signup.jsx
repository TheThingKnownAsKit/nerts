import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from '../firebase/config';
import { auth, db } from '../firebase/config';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);
            navigate('/game');
        } catch (error) {
            console.error("Error signing up:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyUsername = () => {
        // TODO: add verification for unique username in database
    };

    return (
        <div>
            <h1>Signup</h1>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="username" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button
                onClick={handleSignup}
                disabled={isLoading}>
                {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
            <button
                onClick={() => navigate('/')}
                disabled={isLoading}>
                Back
            </button>
        </div>
    );
}

export default Signup;
