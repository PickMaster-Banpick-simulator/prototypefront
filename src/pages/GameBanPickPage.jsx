import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";
import SeriesScoreboard from "../components/SeriesScoreboard";
import { useRoomStore } from "../store/roomStore";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";
import styles from "../styles/GameBanPickPage.module.css";

const BANPICK_ORDER = [
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
  { team: "red", action: "pick" }, { team: "blue", action: "pick" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
  { team: "red", action: "ban" }, { team: "blue", action: "ban" },
  { team: "red", action: "ban" }, { team: "blue", action: "ban" },
  { team: "red", action: "pick" }, { team: "blue", action: "pick" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
];

const GameBanPickPage = () => {
  const navigate = useNavigate();
  const store = useRoomStore();

  const [champions, setChampions] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [blueBans, setBlueBans] = useState(Array(5).fill(null));
  const [redBans, setRedBans] = useState(Array(5).fill(null));
  const [bluePicks, setBluePicks] = useState(Array(5).fill(null));
  const [redPicks, setRedPicks] = useState(Array(5).fill(null));
  const [seriesWinner, setSeriesWinner] = useState(null);

  const currentTurn = BANPICK_ORDER[turnIndex];
  const isBanpickFinished = turnIndex >= BANPICK_ORDER.length;

  const resetBoard = () => {
    setTurnIndex(0);
    setBlueBans(Array(5).fill(null));
    setRedBans(Array(5).fill(null));
    setBluePicks(Array(5).fill(null));
    setRedPicks(Array(5).fill(null));
  };

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await res.json();
        const latest = versions[0];
        const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/ko_KR/champion.json`);
        const champData = await champRes.json();
        const champArray = Object.values(champData.data).map((c) => ({
          id: c.id,
          name: c.name,
          image: `https://ddragon.leagueoflegends.com/cdn/${latest}/img/champion/${c.image.full}`,
        }));
        setChampions(champArray);
      } catch (err) {
        console.error("챔피언 데이터 로딩 실패:", err);
      }
    };
    fetchChampions();
  }, []);

  useEffect(() => {
    resetBoard();
  }, [store.gameSeries.currentGame]);

  useEffect(() => {
    const requiredWins = store.gameMode === 'BO3' ? 2 : 3;
    if (store.gameSeries.blueWins === requiredWins) setSeriesWinner(store.blueTeamName);
    else if (store.gameSeries.redWins === requiredWins) setSeriesWinner(store.redTeamName);
  }, [store.gameSeries.blueWins, store.gameSeries.redWins, store.gameMode, store.blueTeamName, store.redTeamName]);

  const handleSelectChampion = (champion) => {
    if (!currentTurn || isBanpickFinished) return;

    const setter = currentTurn.team === 'blue' 
        ? (currentTurn.action === 'ban' ? setBlueBans : setBluePicks)
        : (currentTurn.action === 'ban' ? setRedBans : setRedPicks);
    
    setter(prev => {
        const newArr = [...prev];
        const idx = newArr.findIndex(val => val === null);
        if (idx !== -1) newArr[idx] = champion;
        return newArr;
    });

    setTurnIndex(prev => prev + 1);
  };

  const handleFinishGame = (winner) => {
    store.finishGame({ bluePicks, redPicks, blueBans, redBans, winner });
  };
  
  const handleReturnToLobby = () => {
    store.startGameSeries();
    navigate('/');
  }

  const getUnselectableChampionNames = () => {
    const picked = [...bluePicks, ...redPicks].filter(Boolean).map(c => c.name);
    const banned = [...blueBans, ...redBans].filter(Boolean).map(c => c.name);
    let unselectable = [...new Set([...picked, ...banned])];
    if (store.gameMode === 'hardFearless') {
        unselectable = [...new Set([...unselectable, ...store.fearlessPicks.map(p => p.name)])];
    }
    return unselectable;
  };

  if (seriesWinner) {
    return (
      <Box className={styles.seriesWinnerContainer}>
        <Typography variant="h1" gutterBottom>SERIES WINNER</Typography>
        <Typography variant="h2" color="primary" sx={{ mb: 4 }}>{seriesWinner}</Typography>
        <Button variant="contained" size="large" onClick={handleReturnToLobby}>
          로비로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" className={styles.pageContainer}>
      <SeriesScoreboard />
      <Box className={styles.banpickLayout}>
        <Box className={styles.teamContainer}>
          <TeamSlot team="blue" bans={blueBans} picks={bluePicks} />
        </Box>

        <Box className={styles.centerContainer}>
          {isBanpickFinished ? (
            <Paper className={styles.winnerDeclaration} elevation={3}>
              <Typography variant="h4">게임 {store.gameSeries.currentGame} 종료</Typography>
              <Typography>승리 팀을 선택하세요:</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="info" onClick={() => handleFinishGame('blue')}>{store.blueTeamName} 승리</Button>
                <Button variant="contained" color="error" onClick={() => handleFinishGame('red')}>{store.redTeamName} 승리</Button>
              </Box>
            </Paper>
          ) : (
            <>
              <TurnTimer />
              <ChampionSelect
                champions={champions}
                onSelect={handleSelectChampion}
                disabledChampions={getUnselectableChampionNames()}
              />
            </>
          )}
        </Box>

        <Box className={styles.teamContainer}>
          <TeamSlot team="red" bans={redBans} picks={redPicks} />
        </Box>
      </Box>
    </Container>
  );
};

export default GameBanPickPage;
