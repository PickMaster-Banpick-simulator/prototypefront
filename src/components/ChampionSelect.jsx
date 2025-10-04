import React, { useState } from 'react';
import { Box, TextField, Paper, Typography, CircularProgress } from '@mui/material';
import styles from '../styles/ChampionSelect.module.css';

const ChampionSelect = ({ champions, onSelect, disabledChampions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!champions || champions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredChampions = champions.filter(champ => 
    champ.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper className={styles.championSelectContainer} elevation={3}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="챔피언 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchBar}
      />
      <Box className={styles.championGrid}>
        {filteredChampions.map((champ) => {
          const isDisabled = disabledChampions.includes(champ.name);
          return (
            <Paper 
              key={champ.id}
              elevation={2}
              className={`${styles.championCard} ${isDisabled ? styles.disabled : ''}`}
              onClick={() => !isDisabled && onSelect(champ)}
            >
              <img src={champ.image} alt={champ.name} className={styles.championImage} />
              <Typography className={styles.championName}>{champ.name}</Typography>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ChampionSelect;
