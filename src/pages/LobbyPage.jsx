
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../store/roomStore";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import styles from "../styles/LobbyPage.module.css";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { rooms, setRooms } = useRoomStore();
  const [newRoomName, setNewRoomName] = useState("");

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;

    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      teamA: [],
      teamB: [],
      spectators: [],
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName("");
    navigate(`/select-mode/${newRoom.id}`);
  };

  const handleEnterRoom = (roomId) => {
    navigate(`/select-mode/${roomId}`);
  };

  return (
    <Container maxWidth="md" className={styles.pageContainer}>
      <Paper className={styles.formContainer} elevation={3}>
        <Typography variant="h1" align="center" gutterBottom>
          Pick Master
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="새로운 방 이름을 입력하세요"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateRoom}
            sx={{ whiteSpace: 'nowrap' }}
          >
            방 만들기
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h3" gutterBottom>
          참여 가능한 방
        </Typography>
        {rooms.length === 0 ? (
          <Typography color="text.secondary" align="center">
            현재 생성된 방이 없습니다.
          </Typography>
        ) : (
          <List>
            {rooms.map((room) => (
              <ListItem
                key={room.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEnterRoom(room.id)}
                    >
                      입장
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      onClick={() => navigate(`/spectate/${room.id}`)}
                    >
                      관전
                    </Button>
                  </Box>
                }
                sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }, borderRadius: 2 }}
              >
                <ListItemText primary={room.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}
