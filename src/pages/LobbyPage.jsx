import { css } from "@emotion/react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../components/CustomTextField";

const API_BASE_URL = "http://localhost:8000/api";

const LobbyPage = () => {
  const navigate = useNavigate();
  const [teamAName, setTeamAName] = useState("");
  const [teamALogo, setTeamALogo] = useState(null);
  const [teamACode, setTeamACode] = useState("TEAM_A");

  const [teamBName, setTeamBName] = useState("");
  const [teamBLogo, setTeamBLogo] = useState(null);
  const [teamBCode, setTeamBCode] = useState("TEAM_B");

  const [matchName, setMatchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 파일 선택 핸들러
  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  // 팀 생성
  const createTeam = async (name, code, logo) => {
    const authToken = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("teamName", name);
    formData.append("teamCode", code);
    if (logo) formData.append("teamLogo", logo);

    const res = await fetch(`${API_BASE_URL}/teams`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`, // Content-Type는 자동
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "팀 생성 실패" }));
      throw new Error(errorData.message || "팀 생성 실패");
    }

    const data = await res.json();
    return data.data || data; // CommonResDto 구조에 따라 처리
  };

  const handleCreateMatch = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. 팀 A 생성
      const teamAData = await createTeam(teamAName, teamACode, teamALogo);
      const teamAId = teamAData.id;
      if (!teamAId) throw new Error("Team A ID를 찾을 수 없습니다.");

      // 2. 팀 B 생성
      const teamBData = await createTeam(teamBName, teamBCode, teamBLogo);
      const teamBId = teamBData.id;
      if (!teamBId) throw new Error("Team B ID를 찾을 수 없습니다.");

      // 3. 매치 생성
      const authToken = localStorage.getItem("authToken");
      const matchRes = await fetch(`${API_BASE_URL}/matches/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          matchName,
          teamAId,
          teamBId,
          numberOfGames: 3,
          banRule: "STANDARD",
          matchType: "BO3",
          allowSpectators: true,
        }),
      });

      if (!matchRes.ok) {
        const errorData = await matchRes.json().catch(() => ({ message: "매치 생성 실패" }));
        throw new Error(errorData.message || "매치 생성 실패");
      }

      const matchData = await matchRes.json();
      const matchId = matchData.data?.id || matchData.id;
      if (!matchId) throw new Error("Match ID를 찾을 수 없습니다.");

      // 4. 게임 시작
      const gameRes = await fetch(`${API_BASE_URL}/games/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ matchId, gameOrder: 1 }),
      });

      if (!gameRes.ok) {
        const errorData = await gameRes.json().catch(() => ({ message: "게임 시작 실패" }));
        throw new Error(errorData.message || "게임 시작 실패");
      }

      const gameData = await gameRes.json();
      const gameId = gameData.data?.id || gameData.id;
      if (!gameId) throw new Error("Game ID를 찾을 수 없습니다.");

      // 5. Ban-Pick 페이지로 이동
      navigate(`/ban-pick/${gameId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = teamAName && teamBName && matchName && !loading;

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        gap: 1rem;
        padding: 2rem;
        background-color: #f0f2f5;
      `}
    >
      <h1>롤 게임 벤픽 시뮬레이터</h1>
      <div
        css={css`
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          max-width: 400px;
        `}
      >
        <h2>새로운 매치 생성</h2>

        {error && <Alert severity="error">{error}</Alert>}

        <CustomTextField
          id="matchName"
          placeholder="매치 이름"
          label="매치 이름"
          onChange={setMatchName}
          disabled={loading}
        />

        <CustomTextField
          id="teamAName"
          placeholder="팀 A 이름"
          label="팀 A 이름"
          onChange={setTeamAName}
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setTeamALogo)}
          disabled={loading}
        />
        {teamALogo && (
          <img
            src={URL.createObjectURL(teamALogo)}
            alt="팀 A 로고"
            width={80}
            css={css`margin-top: 0.5rem; border-radius: 4px;`}
          />
        )}

        <CustomTextField
          id="teamBName"
          placeholder="팀 B 이름"
          label="팀 B 이름"
          onChange={setTeamBName}
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setTeamBLogo)}
          disabled={loading}
        />
        {teamBLogo && (
          <img
            src={URL.createObjectURL(teamBLogo)}
            alt="팀 B 로고"
            width={80}
            css={css`margin-top: 0.5rem; border-radius: 4px;`}
          />
        )}

        {loading ? (
          <div css={css`display: flex; justify-content: center;`}><CircularProgress /></div>
        ) : (
          <Button
            variant="contained"
            onClick={handleCreateMatch}
            disabled={!isFormValid}
            size="large"
          >
            매치 생성 및 게임 시작
          </Button>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
