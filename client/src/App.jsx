import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Host from "./pages/Host.jsx";
import Settings from "./pages/Settings.jsx";
import Rules from "./pages/Rules.jsx";
import './App.css';
import { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

function App() {

  useEffect(() => {
    socket.on("welcome", (message) => {
      console.log("Server says:", message);
      socket.emit("thanks", "Thanks for the welcome!");
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/host" element={<Host />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App