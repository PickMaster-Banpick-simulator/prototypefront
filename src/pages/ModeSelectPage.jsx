import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useRoomStore } from "../store/roomStore";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from "@mui/material";
import styles from "../styles/ModeSelectPage.module.css";

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { setGameInfo, startGameSeries } = useRoomStore();

  const [mode, setMode] = useState("TOURNAMENT");
  const [blueName, setBlueName] = useState("");
  const [redName, setRedName] = useState("");
  const [error, setError] = useState("");

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleStart = () => {
    if (!blueName.trim() || !redName.trim()) {
      setError("팀 이름을 모두 입력해주세요!");
      return;
    }
    setError("");

    setGameInfo({ mode, blueName, redName });
    startGameSeries();

    const params = new URLSearchParams({
      banpickMode: "draft",
      playerMode: "solo",
      roomId: roomId,
    });
    navigate(`/banpick?${params.toString()}`);
  };

  return (
    <Container maxWidth="md" className={styles.pageContainer}>
      <Paper className={styles.formContainer} elevation={3}>
        <Typography variant="h2" align="center" gutterBottom>
          게임 모드 설정
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="game mode"
          >
            <ToggleButton value="TOURNAMENT" aria-label="tournament mode">
              토너먼트 드래프트
            </ToggleButton>
            <ToggleButton value="BO3" aria-label="best of 3">
              3전 2선승
            </ToggleButton>
            <ToggleButton value="BO5" aria-label="best of 5">
              5전 3선승
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="블루팀 이름"
            value={blueName}
            onChange={(e) => setBlueName(e.target.value)}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="레드팀 이름"
            value={redName}
            onChange={(e) => setRedName(e.target.value)}
          />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
        >
          밴픽 시작하기
        </Button>
      </Paper>
    </Container>
  );
}
