
import React from 'react';
import { useRoomStore } from '../store/roomStore';
import { Box, Typography, Paper } from '@mui/material';
import styles from '../styles/TeamSlot.module.css';

const TeamSlot = ({ team, picks, bans }) => {
  const { blueTeamName, redTeamName } = useRoomStore();
  const teamName = team === 'blue' ? blueTeamName : redTeamName;

  const BanCard = ({ champion }) => (
    <Paper className={styles.banCard} elevation={2}>
      {champion ? (
        <img src={champion.image} alt={champion.name} className={`${styles.championImage} ${styles.bannedImage}`} />
      ) : (
        <Box className={styles.emptySlot} />
      )}
    </Paper>
  );

  const PickCard = ({ champion }) => (
    <Paper className={styles.pickCard} elevation={2}>
      {champion ? (
        <>
          <img src={champion.image} alt={champion.name} className={styles.championImage} />
          <Typography className={styles.championName}>{champion.name}</Typography>
        </>
      ) : (
        <Box className={styles.emptySlot} />
      )}
    </Paper>
  );

  return (
    <Box className={styles.teamSlotContainer}>
      <Typography variant="h4" className={`${styles.teamName} ${styles[team]}`}>
        {teamName || (team === 'blue' ? 'Blue Team' : 'Red Team')}
      </Typography>

      <Box mb={3}>
        <Typography variant="h6" className={styles.sectionTitle}>BANS</Typography>
        <Box className={styles.cardList}>
          {bans.map((ban, index) => <BanCard key={index} champion={ban} />)}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" className={styles.sectionTitle}>PICKS</Typography>
        <Box className={styles.cardList}>
          {picks.map((pick, index) => <PickCard key={index} champion={pick} />)}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamSlot;
