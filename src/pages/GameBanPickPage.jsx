import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";

import styles from "../styles/Banpick.module.css";

const BANPICK_ORDERS = {
  draft: [
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
  ],
  softFearless: [
    // 소프트 피어리스 밴픽 순서 (토너먼트 드래프트와 동일)
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
  ],
  hardFearless: [
    // 하드 피어리스 밴픽 순서 (토너먼트 드래프트와 동일)
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "ban" },
    { team: "blue", action: "ban" },
    { team: "red", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "blue", action: "pick" },
    { team: "red", action: "pick" },
  ],
};

const GameBanPickPage = () => {
  const [searchParams] = useSearchParams();
  const [blueTeamName, setBlueTeamName] = useState("Blue Team");
  const [redTeamName, setRedTeamName] = useState("Red Team");
  const [timeLimit, setTimeLimit] = useState(30);

  const [banpickMode, setBanpickMode] = useState('draft');
  const [currentTurnOrder, setCurrentTurnOrder] = useState(BANPICK_ORDERS.draft);

  const [setCount, setSetCount] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [blueWins, setBlueWins] = useState(0);
  const [redWins, setRedWins] = useState(0);

  const [champions, setChampions] = useState([]);
  const [bluePicks, setBluePicks] = useState([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState([null, null, null, null, null]);
  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const currentTurn = currentTurnOrder[turnIndex];
  const isGameFinished = blueWins > setCount / 2 || redWins > setCount / 2;
  const isSetFinished = turnIndex >= currentTurnOrder.length;

  useEffect(() => {
    setBlueTeamName(searchParams.get("blueTeam") || "Blue Team");
    setRedTeamName(searchParams.get("redTeam") || "Red Team");
    const timeParam = searchParams.get("timeLimit");
    if (timeParam === 'off') {
      setTimeLimit(Infinity);
      setTimeLeft(Infinity);
    } else {
      setTimeLimit(30);
      setTimeLeft(30);
    }

    const mode = searchParams.get('banpickMode') || 'draft';
    setBanpickMode(mode);
    setCurrentTurnOrder(BANPICK_ORDERS[mode] || BANPICK_ORDERS.draft);

    const setCountParam = parseInt(searchParams.get('setCount'), 10) || 1;
    setSetCount(setCountParam);

  }, [searchParams]);

  // Riot API 불러오기
  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/15.17.1/data/ko_KR/champion.json"
        );
        const data = await res.json();
        const championsArr = Object.values(data.data).map((c) => ({
          id: c.id,
          name: c.name,
          image: `https://ddragon.leagueoflegends.com/cdn/${data.version}/img/champion/${c.image.full}`,
          tags: c.tags,
        }));
        setChampions(championsArr);
      } catch (err) {
        console.error("챔피언 데이터 로드 실패:", err);
      }
    };
    fetchChampions();
  }, []);

  // 타이머
  useEffect(() => {
    if (!currentTurn || timeLimit === Infinity) return;
    setTimeLeft(timeLimit);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSkip();
          return timeLimit;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [turnIndex, timeLimit]);

  const playerMode = searchParams.get("playerMode");

  // WebSocket을 사용한 실시간 통신 로직
  useEffect(() => {
    // 1vs1 모드일 때만 소켓 로직을 실행합니다.
    if (playerMode !== '1vs1') return;

    // 서버로부터 게임 상태 업데이트를 받습니다.
    const handleGameUpdate = (updatedGame) => {
      setBluePicks(updatedGame.bluePicks);
      setRedPicks(updatedGame.redPicks);
      setBlueBans(updatedGame.blueBans);
      setRedBans(updatedGame.redBans);
      setTurnIndex(updatedGame.turnIndex);
    };

    // 소켓 이벤트 리스너 등록
    // socket.on('gameUpdate', handleGameUpdate);

    // 컴포넌트 언마운트 시 소켓 리스너 정리
    return () => {
      // socket.off('gameUpdate', handleGameUpdate);
    };
  }, [playerMode]);

  // 선택/밴 처리
  const handleSelectChampion = (champion) => {
    if (!currentTurn) return;

    // 1vs1 모드인 경우, 서버로 액션을 전송합니다.
    if (playerMode === '1vs1') {
      // socket.emit('selectChampion', { champion });
    } else {
      // 솔로 모드인 경우, 클라이언트 자체적으로 상태를 업데이트합니다.
      const { team, action } = currentTurn;
      const championData = { name: champion.name, image: champion.image };

      const updateSlot = (arr, setArr) => {
        const idx = arr.findIndex((p) => p === null);
        if (idx !== -1) {
          const updated = [...arr];
          updated[idx] = championData;
          setArr(updated);
        }
      };

      if (action === "pick") {
        team === "blue"
          ? updateSlot(bluePicks, setBluePicks)
          : updateSlot(redPicks, setRedPicks);
      } else if (action === "ban") {
        team === "blue"
          ? updateSlot(blueBans, setBlueBans)
          : updateSlot(redBans, setRedBans);
      }

      setTurnIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (playerMode === '1vs1') {
      // socket.emit('skipTurn');
    } else {
      setTurnIndex((prev) => prev + 1);
    }
  };

  const selectedChampions = [...bluePicks, ...redPicks, ...blueBans, ...redBans].filter(Boolean);

  const getAvailableChampions = () => {
    const pickedNames = [...bluePicks, ...redPicks].filter(Boolean).map((c) => c.name);
    const bannedNames = [...blueBans, ...redBans].filter(Boolean).map((c) => c.name);

    let unselectableNames = [...bannedNames];

    if (banpickMode === 'softFearless') {
        // 소프트 피어리스: 자기 팀이 이미 고른 챔피언은 다시 못 고름
        if (currentTurn?.team === 'blue') {
            unselectableNames = [...unselectableNames, ...bluePicks.filter(Boolean).map(c => c.name)];
        } else if (currentTurn?.team === 'red') {
            unselectableNames = [...unselectableNames, ...redPicks.filter(Boolean).map(c => c.name)];
        }
    } else if (banpickMode === 'hardFearless') {
        // 하드 피어리스: 양 팀에서 한번이라도 나온 챔피언은 다시 못 고름
        unselectableNames = [...unselectableNames, ...pickedNames];
    }


    return champions.filter((c) => !unselectableNames.includes(c.name));
  };

  const handleWin = (winningTeam) => {
    if (winningTeam === 'blue') {
      setBlueWins(prev => prev + 1);
    } else {
      setRedWins(prev => prev + 1);
    }
    setCurrentSet(prev => prev + 1);
    setTurnIndex(0);
    setBluePicks([null, null, null, null, null]);
    setRedPicks([null, null, null, null, null]);
    setBlueBans([null, null, null, null, null]);
    setRedBans([null, null, null, null, null]);
  };

  const renderCenterContent = () => {
    if (isGameFinished) {
      return (
        <div className={styles.gameEndContainer}>
          <h2 className={styles.gameEndTitle}>게임 종료</h2>
          <h3 className={styles.gameEndWinner}>
            {blueWins > redWins ? blueTeamName : redTeamName} 최종 승리!
          </h3>
          <p className={styles.gameEndScore}>{blueWins} : {redWins}</p>
        </div>
      );
    }

    if (isSetFinished) {
      return (
        <div className={styles.setEndContainer}>
          <h2 className={styles.setEndTitle}>{currentSet}세트 종료</h2>
          <p className={styles.setEndInstruction}>승리한 팀을 선택하세요.</p>
          <div className={styles.winButtonContainer}>
            <button onClick={() => handleWin('blue')} className={`${styles.winButton} ${styles.blueButton}`}>{blueTeamName} 승리</button>
            <button onClick={() => handleWin('red')} className={`${styles.winButton} ${styles.redButton}`}>{redTeamName} 승리</button>
          </div>
        </div>
      );
    }

    return (
      <>
        <TurnTimer timeLeft={timeLeft} />
        <p className={styles.turnInfo}>
          {currentTurn?.team.toUpperCase()}팀 {currentTurn?.action.toUpperCase()} 중
        </p>
        {champions.length ? (
          <ChampionSelect
            champions={getAvailableChampions()}
            onSelect={handleSelectChampion}
            selectedChampions={[...bluePicks, ...redPicks, ...blueBans, ...redBans].filter(Boolean).map((c) => c.name)}
          />
        ) : (
          <p className={styles.loading}>챔피언 데이터를 불러오는 중...</p>
        )}
      </>
    );
  }

  return (
    <div className={styles.banpickContainer}>
      <TeamSlot team="blue" teamName={blueTeamName} picks={bluePicks} bans={blueBans} />
      <div className={styles.centerContainer}>
        <div className={styles.scoreBoard}>
          <span>{currentSet}세트</span>
          <span>{blueWins} : {redWins}</span>
        </div>
        {renderCenterContent()}
      </div>
      <TeamSlot team="red" teamName={redTeamName} picks={redPicks} bans={redBans} />
    </div>
  );
};

export default GameBanPickPage;
