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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import styles from "../styles/ModeSelectPage.module.css";

export default function ModeSelectPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { setGameInfo, startGameSeries } = useRoomStore();

  const [patch, setPatch] = useState("25.19");
  const [gameName, setGameName] = useState("");
  const [blueName, setBlueName] = useState("");
  const [redName, setRedName] = useState("");
  const [playerMode, setPlayerMode] = useState("solo");
  const [banMode, setBanMode] = useState("tournament");
  const [setCount, setSetCount] = useState("single");
  const [timerMode, setTimerMode] = useState("default");
  const [globalBans, setGlobalBans] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const handleStart = () => {
    if (!gameName.trim() || !blueName.trim() || !redName.trim()) {
      alert("경기 이름과 팀 이름을 모두 입력해주세요!");
      return;
    }

    setGameInfo({
      patch,
      gameName,
      blueName,
      redName,
      playerMode,
      banMode,
      setCount,
      timerMode,
      globalBans,
      imageFile,
    });
    startGameSeries();

    const params = new URLSearchParams({
      banpickMode: "draft",
      playerMode,
      roomId,
    });
    navigate(`/banpick?${params.toString()}`);
  };

  const handleAddGlobalBan = () => {
    const champ = prompt("추가할 글로벌 밴 챔피언 이름을 입력하세요:");
    if (champ) setGlobalBans([...globalBans, champ]);
  };

  return (
    <Container maxWidth="md" className={styles.pageContainer}>
      <Paper className={styles.formContainer} elevation={3}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 3 }}>
          게임 설정
        </Typography>

        {/* 패치 & 경기 이름 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <FormControl sx={{ flex: 1, minWidth: 120 }}>
            <InputLabel>패치 버전</InputLabel>
            <Select
              value={patch}
              label="패치 버전"
              onChange={(e) => setPatch(e.target.value)}
            >
              <MenuItem value="25.19">25.19</MenuItem>
              <MenuItem value="25.18">25.18</MenuItem>
              <MenuItem value="25.17">25.17</MenuItem>
            </Select>
          </FormControl>

          <TextField
            sx={{ flex: 2, minWidth: 200 }}
            label="경기 이름"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </Box>

        {/* 팀 이름 */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
          <TextField
            sx={{ flex: 1, minWidth: 150 }}
            label="블루팀 이름"
            value={blueName}
            onChange={(e) => setBlueName(e.target.value)}
          />
          <TextField
            sx={{ flex: 1, minWidth: 150 }}
            label="레드팀 이름"
            value={redName}
            onChange={(e) => setRedName(e.target.value)}
          />
        </Box>

        {/* 플레이어 모드 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <ToggleButtonGroup
            value={playerMode}
            exclusive
            onChange={(e, val) => val && setPlayerMode(val)}
          >
            <ToggleButton value="solo">솔로</ToggleButton>
            <ToggleButton value="1v1">1v1</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 밴픽 모드 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <ToggleButtonGroup
            value={banMode}
            exclusive
            onChange={(e, val) => val && setBanMode(val)}
          >
            <ToggleButton value="tournament">토너먼트 드래프트</ToggleButton>
            <ToggleButton value="hardFearless">하드 피어리스</ToggleButton>
            <ToggleButton value="softFearless">소프트 피어리스</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 세트 수 선택 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <ToggleButtonGroup
            value={setCount}
            exclusive
            onChange={(e, val) => val && setSetCount(val)}
          >
            <ToggleButton value="single">단판제</ToggleButton>
            <ToggleButton value="BO3">3판 2선승</ToggleButton>
            <ToggleButton value="BO5">5판 3선승</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 밴픽 타이머 */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <ToggleButtonGroup
            value={timerMode}
            exclusive
            onChange={(e, val) => val && setTimerMode(val)}
          >
            <ToggleButton value="default">대회와 동일하게</ToggleButton>
            <ToggleButton value="infinite">시간 무제한</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 글로벌 밴 챔피언 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
          <Button variant="outlined" onClick={handleAddGlobalBan}>+</Button>
          <Typography variant="body2">글로벌 밴 챔피언: {globalBans.join(", ") || "없음"}</Typography>
        </Box>

        {/* 이미지 업로드 */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 3 }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Box>

        <Button variant="contained" size="large" onClick={handleStart} fullWidth>
          생성
        </Button>
      </Paper>
    </Container>
  );
}
