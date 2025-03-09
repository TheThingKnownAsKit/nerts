import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Host from "./pages/Host.jsx";
import Settings from "./pages/Settings.jsx";
import Rules from "./pages/Rules.jsx";
import User from "./pages/User.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game/:lobbyID" element={<Game />} />
        <Route path="/host" element={<Host />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
