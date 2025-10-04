import React, { useState, useEffect, useRef } from "react"; // useRef 추가
import { useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas'; // html2canvas import
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";
import SeriesScoreboard from "../components/SeriesScoreboard";
import { useRoomStore } from "../store/roomStore";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import styles from "../styles/GameBanPickPage.module.css";

const BANPICK_ORDER = [
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "ban" }, { team: "red", action: "ban" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
  { team: "red", action: "pick" }, { team: "blue", action: "pick" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
  { team: "red", action: "ban" }, { team: "blue", action: "ban" },
  { team: "red", action: "ban" }, { team: "blue", "action": "ban" },
  { team: "red", action: "pick" }, { team: "blue", action: "pick" },
  { team: "blue", action: "pick" }, { team: "red", action: "pick" },
];

const GameBanPickPage = () => {
  const navigate = useNavigate();
  const store = useRoomStore();
  const captureRef = useRef(null); // 캡처할 영역을 위한 ref 추가

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

  // 챔피언 데이터 불러오기
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

  // 게임 초기화
  useEffect(() => {
    if (!seriesWinner) {
      resetBoard();
    }
  }, [store.gameSeries.currentGame, seriesWinner]);

  // 시리즈 승리 팀 확인
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

  // --- 화면 캡처 핸들러 함수 추가 ---
  const handleCapture = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#111827',
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `pick-master-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("화면 캡처 중 오류 발생:", error);
      alert("화면 캡처에 실패했습니다.");
    }
  };

  const getUnselectableChampionNames = () => {
    const currentPicked  = [...bluePicks, ...redPicks].filter(c => c !== null).map(c => c.name);
    const currentBanned = [...blueBans, ...redBans].filter(c => c !== null).map(c => c.name);
    let unselectable = new Set([...currentPicked, ...currentBanned]);
    const previousGames = (store.gameSeries.games || []).slice(0, store.gameSeries.currentGame - 1);
    const previousPicksAndBans = previousGames.flatMap(game =>
      [
        ...(game.bluePicks || []).map(c => c.name),
        ...(game.redPicks || []).map(c => c.name),
        ...(game.blueBans || []).map(c => c.name),
        ...(game.redBans || []).map(c => c.name),
      ].filter(Boolean)
    );
    unselectable = new Set([...unselectable, ...previousPicksAndBans]);
    return unselectable;
  };

  const renderPreviousGames = () => {
    const previousGames = (store.gameSeries.games || []).slice(0, store.gameSeries.currentGame - 1);
    return previousGames.map((game, idx) => (
      <Paper key={idx} className={styles.gbpHistoryGame} elevation={2}>
        <Typography variant="subtitle2">게임 {idx + 1}</Typography>
        <Box className={styles.gbpHistoryRow}>
          <Box>
            <Typography variant="caption" color="primary">{store.blueTeamName}</Typography>
            <Box className={styles.gbpHistoryChampions}>
              {[...(game.blueBans || []), ...(game.bluePicks || [])].map((c, i) => c && (
                <img key={i} src={c.image} alt={c.name} className={styles.gbpHistoryImage} />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="error">{store.redTeamName}</Typography>
            <Box className={styles.gbpHistoryChampions}>
              {[...(game.redBans || []), ...(game.redPicks || [])].map((c, i) => c && (
                <img key={i} src={c.image} alt={c.name} className={styles.gbpHistoryImage} />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    ));
  };

  if (seriesWinner) {
    return (
      <Container maxWidth="xl" className={styles.gbpPageContainer} ref={captureRef}>
        <SeriesScoreboard isFinal={true} />
        <Box className={styles.gbpBanpickLayout}>
          <Box className={styles.gbpTeamContainer}>
            <TeamSlot team="blue" bans={blueBans} picks={bluePicks} />
          </Box>
          <Box className={styles.gbpCenterContainer}>
            <Paper className={styles.gbpWinnerDeclaration} elevation={3}>
              <Typography variant="h4">시리즈 종료</Typography>
              <Typography gutterBottom>최종 우승: {seriesWinner}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={handleCapture}>결과 저장 (캡처)</Button>
                <Button variant="outlined" onClick={handleReturnToLobby}>로비로 돌아가기</Button>
              </Box>
            </Paper>
          </Box>
          <Box className={styles.gbpTeamContainer}>
            <TeamSlot team="red" bans={redBans} picks={redPicks} />
          </Box>
        </Box>
        <Box className={styles.gbpPreviousGamesContainer}>
          {renderPreviousGames()}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className={styles.gbpPageContainer}>
      <SeriesScoreboard />
      <Box className={styles.gbpBanpickLayout}>
        <Box className={styles.gbpTeamContainer}>
          <TeamSlot team="blue" bans={blueBans} picks={bluePicks} />
        </Box>
        <Box className={styles.gbpCenterContainer}>
          {isBanpickFinished ? (
            <Paper className={styles.gbpWinnerDeclaration} elevation={3}>
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
                disabledChampions={[...getUnselectableChampionNames()]} 
              />
            </>
          )}
        </Box>
        <Box className={styles.gbpTeamContainer}>
          <TeamSlot team="red" bans={redBans} picks={redPicks} />
        </Box>
      </Box>
      <Box className={styles.gbpPreviousGamesContainer}>
        {renderPreviousGames()}
      </Box>
    </Container>
  );
};

export default GameBanPickPage;