import { useParams } from "react-router-dom";
import { useRoomStore } from "../store/roomStore";
import TeamSlot from "../components/TeamSlot";
import SeriesScoreboard from "../components/SeriesScoreboard";
import { Container, Box, Typography } from "@mui/material";
import styles from "../styles/SpectatorPage.module.css";

// 임시 데이터 (실제로는 store나 props에서 받아야 함)
const tempPicks = Array(5).fill(null);
const tempBans = Array(5).fill(null);

export default function SpectatorPage() {
  const { roomId } = useParams();
  // `useRoomStore`에서 실제 밴픽 데이터를 가져와야 합니다.
  // 현재는 임시 데이터를 사용하고 있습니다.
  // const { bluePicks, redPicks, blueBans, redBans } = useRoomStore(state => state.banpickData); // 예시

  return (
    <Container maxWidth="xl" className={styles.pageContainer}>
      <Typography variant="h2" className={styles.title}>
        관전 모드 - 방 ID: {roomId}
      </Typography>
      
      <SeriesScoreboard />

      <Box className={styles.banpickLayout}>
        <Box className={styles.teamContainer}>
          {/* 
            실제 데이터를 props로 전달해야 합니다. 
            예: <TeamSlot team="blue" picks={bluePicks} bans={blueBans} />
          */}
          <TeamSlot team="blue" picks={tempPicks} bans={tempBans} />
        </Box>
        <Box className={styles.teamContainer}>
          {/* 
            실제 데이터를 props로 전달해야 합니다. 
            예: <TeamSlot team="red" picks={redPicks} bans={redBans} />
          */}
          <TeamSlot team="red" picks={tempPicks} bans={tempBans} />
        </Box>
      </Box>
    </Container>
  );
}