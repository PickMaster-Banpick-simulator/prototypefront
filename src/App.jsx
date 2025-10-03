import { Routes, Route } from "react-router-dom";
import  LobbyPage  from "./pages/LobbyPage";  // 방 목록 페이지  
import GameBanPickPage from "./pages/GameBanPickPage";
import SpectatorPage from "./pages/SpectatorPage";
import ModeSelectPage from "./pages/ModeSelectPage";
 // 방 생성 페이지

const App = () => {
  return (
    <Routes>
      {/* 초기 페이지: 방 생성 */}
      <Route path="/" element={<LobbyPage />} />
      
      {/* 모드 선택 페이지 */}
      <Route path="/select-mode/:roomId" element={<ModeSelectPage />} />
      
      {/* 벤픽 페이지 */}
      <Route path="/banpick" element={<GameBanPickPage />} />
      
      {/* 관전자 페이지 */}
      <Route path="/spectate/:roomId" element={<SpectatorPage />} />
    </Routes>
  );
};

export default App;
