import React, { useState, useEffect } from "react";
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";
import styles from "../styles/Banpick.module.css";

const BANPICK_ORDER = [
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
];

const GameBanPickPage = () => {
  const [champions, setChampions] = useState(null);

  const [bluePicks, setBluePicks] = useState([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState([null, null, null, null, null]);
  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);

  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentTurn = BANPICK_ORDER[turnIndex];

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await fetch(
          "https://ddragon.leagueoflegends.com/cdn/15.17.1/data/ko_KR/champion.json"
        );
        const data = await res.json();
        setChampions(data);
      } catch (error) {
        console.error("챔피언 데이터 로드 실패:", error);
      }
    };
    fetchChampions();
  }, []);

  useEffect(() => {
    if (turnIndex >= BANPICK_ORDER.length) return;

    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSkip();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [turnIndex]);

  const handleSelectChampion = (champion) => {
    if (!currentTurn) return;

    const { team, action } = currentTurn;

    const updateSlot = (arr, setArr) => {
      const idx = arr.findIndex((p) => p === null);
      if (idx !== -1) {
        const updated = [...arr];
        updated[idx] = champion.name;
        setArr(updated);
      }
    };

    if (action === "pick") {
      team === "blue" ? updateSlot(bluePicks, setBluePicks) : updateSlot(redPicks, setRedPicks);
    } else if (action === "ban") {
      team === "blue" ? updateSlot(blueBans, setBlueBans) : updateSlot(redBans, setRedBans);
    }

    setTurnIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    setTurnIndex((prev) => prev + 1);
  };

  const selectedChampions = [
    ...bluePicks,
    ...redPicks,
    ...blueBans,
    ...redBans,
  ].filter(Boolean);

  return (
    <div className={styles.banpickContainer}>
      <TeamSlot team="blue" picks={bluePicks} bans={blueBans} />
      <div className={styles.centerContainer}>
        <TurnTimer timeLeft={timeLeft} />
        <p style={{ color: "#fff", textAlign: "center" }}>
          {currentTurn?.team.toUpperCase()}팀 {currentTurn?.action.toUpperCase()} 중
        </p>
        {champions ? (
          <ChampionSelect
            champions={champions}
            onSelect={handleSelectChampion}
            selectedChampions={selectedChampions}
          />
        ) : (
          <p className={styles.loading}>챔피언 데이터를 불러오는 중...</p>
        )}
      </div>
      <TeamSlot team="red" picks={redPicks} bans={redBans} />
    </div>
  );
};

export default GameBanPickPage;
