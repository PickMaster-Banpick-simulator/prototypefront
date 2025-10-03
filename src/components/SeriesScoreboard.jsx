
import React from 'react';
import { useRoomStore } from '../store/roomStore';
import { Box, Typography, Paper } from '@mui/material';

const SeriesScoreboard = () => {
  const { gameMode, blueTeamName, redTeamName, gameSeries } = useRoomStore();

  if (gameMode === 'TOURNAMENT') {
    return null; // 단판 모드에서는 스코어보드를 표시하지 않음
  }

  const requiredWins = gameMode === 'BO3' ? 2 : 3;

  const WinCircle = ({ filled }) => (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        backgroundColor: filled ? 'success.main' : 'grey.700',
        mx: 0.5,
      }}
    />
  );

  const getWinCircles = (wins) => {
    return Array.from({ length: requiredWins }).map((_, i) => (
      <WinCircle key={i} filled={i < wins} />
    ));
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
      <Typography variant="h6" align="center" gutterBottom>{gameMode}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h5" sx={{ color: '#64b5f6' }}>{blueTeamName}</Typography>
          <Box sx={{ display: 'flex', mt: 1 }}>{getWinCircles(gameSeries.blueWins)}</Box>
        </Box>
        <Typography variant="h4">{gameSeries.blueWins} - {gameSeries.redWins}</Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ color: '#e57373' }}>{redTeamName}</Typography>
          <Box sx={{ display: 'flex', mt: 1 }}>{getWinCircles(gameSeries.redWins)}</Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SeriesScoreboard;
