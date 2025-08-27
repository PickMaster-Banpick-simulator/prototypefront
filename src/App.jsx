import { Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import GameBanPickPage from "./pages/GameBanPickPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage/>} />
      <Route path="/game" element={<GameBanPickPage />} />
    </Routes>
  );
};

export default App;
