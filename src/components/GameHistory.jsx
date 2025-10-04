import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import styles from '../styles/GameHistory.module.css';

const GameHistory = ({ games, teamNames }) => {
    return (
        <Paper className={styles.historyContainer} elevation={2}>
            {games.map((game, index) => (
                <Box key={index} className={styles.gameRow}>
                    <Typography className={styles.gameNumber}>게임 {index + 1}</Typography>
                    
                    <Box className={styles.teamHistory}>
                        <Typography className={styles.teamNameBlue}>{teamNames.blue}</Typography>
                        <Box className={styles.championIcons}>
                            {game.bluePicks.map(p => <img key={p.id} src={p.image} alt={p.name} />)}
                            <Box className={styles.divider} />
                            {game.blueBans.map(b => <img key={b.id} src={b.image} alt={b.name} />)}
                        </Box>
                    </Box>

                    <Box className={styles.teamHistory}>
                         <Box className={styles.championIconsRight}>
                            {game.redBans.map(b => <img key={b.id} src={b.image} alt={b.name} />)}
                            <Box className={styles.divider} />
                            {game.redPicks.map(p => <img key={p.id} src={p.image} alt={p.name} />)}
                        </Box>
                        <Typography className={styles.teamNameRed}>{teamNames.red}</Typography>
                    </Box>
                </Box>
            ))}
        </Paper>
    );
};

export default GameHistory;