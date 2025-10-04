import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../store/roomStore";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

import styles from "../styles/LobbyPage.module.css";

// --- 랜덤 코드 생성 함수 (영문+숫자, 5자리) ---
const generateRoomCode = (length = 5) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

export default function LobbyPage() {
  const navigate = useNavigate();
  const { rooms, setRooms } = useRoomStore();
  const [newRoomName, setNewRoomName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [lastCreatedCode, setLastCreatedCode] = useState("");

  // --- 방 생성 ---
  const handleCreateRoom = () => {
    const trimmedName = newRoomName.trim();
    if (!trimmedName) return;

    // 랜덤 코드 생성 + 중복 체크
    let newId;
    do {
      newId = generateRoomCode();
    } while (rooms.some(r => r.id === newId));

    const newRoom = {
      id: newId,
      name: trimmedName,
      players: [],
      spectators: [],
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    setLastCreatedCode(newId);
    navigate(`/select-mode/${newId}`);
  };

  // --- 방 참여 ---
  const handleJoinWithId = (code) => {
    const codeToJoin = code.trim().toUpperCase();
    if (!codeToJoin) {
      alert("참여할 방의 코드를 입력해주세요.");
      return;
    }

    const roomExists = rooms.find(room => room.id === codeToJoin);
    if (roomExists) {
      navigate(`/select-mode/${codeToJoin}`);
    } else {
      alert("존재하지 않는 방입니다. 코드를 다시 확인해주세요.");
    }
  };

  // --- 코드 복사 ---
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`방 코드 ${code} 복사 완료!`);
  };

  return (
    <Container maxWidth="md" className={styles.pageContainer}>
      <Paper className={styles.formContainer} elevation={3}>
        <Typography variant="h1" align="center" gutterBottom>
          Pick Master
        </Typography>

        {/* 방 만들기 */}
        <Typography variant="h4" gutterBottom>방 만들기</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="새로운 방 이름을 입력하세요"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRoom}
            sx={{ whiteSpace: 'nowrap' }}
          >
            만들기
          </Button>
        </Box>

        {lastCreatedCode && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1, flexWrap: 'wrap' }}>
            <Typography>방 코드: {lastCreatedCode}</Typography>
            <Tooltip title="복사하기">
              <IconButton onClick={() => handleCopyCode(lastCreatedCode)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" size="small" onClick={() => handleJoinWithId(lastCreatedCode)}>
              바로 참여
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* 코드로 참여 */}
        <Typography variant="h4" gutterBottom>코드로 참여하기</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="방 코드를 입력하세요 (예: A1B2C)"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinWithId(joinRoomId)}
            size="small"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleJoinWithId(joinRoomId)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            참여하기
          </Button>
        </Box>

        {/* 현재 생성된 방 목록 */}
        {rooms.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" gutterBottom>현재 생성된 방</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {rooms.map((room) => (
                <Paper key={room.id} sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography>{room.name} ({room.id})</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" variant="outlined" onClick={() => handleCopyCode(room.id)}>복사</Button>
                    <Button size="small" variant="contained" onClick={() => handleJoinWithId(room.id)}>참여</Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
