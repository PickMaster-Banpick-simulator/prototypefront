import React, { useState, useEffect } from "react";
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";
import styles from "../styles/Banpick.module.css";
import champions from "../data/champions.json"; // ✅ default import

// 밴픽 순서 (LoL 대회 룰 기반 확장)
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
  const [bluePicks, setBluePicks] = useState([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState([null, null, null, null, null]);
  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);

  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentTurn = BANPICK_ORDER[turnIndex];

  // 타이머 로직
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

  // 선택 처리
  const handleSelectChampion = (champion) => {
    if (!currentTurn) return;

    const { team, action } = currentTurn;

    if (action === "pick") {
      if (team === "blue") {
        const idx = bluePicks.findIndex((p) => p === null);
        if (idx !== -1) {
          const updated = [...bluePicks];
          updated[idx] = champion;
          setBluePicks(updated);
        }
      } else {
        const idx = redPicks.findIndex((p) => p === null);
        if (idx !== -1) {
          const updated = [...redPicks];
          updated[idx] = champion;
          setRedPicks(updated);
        }
      }
    } else if (action === "ban") {
      if (team === "blue") {
        const idx = blueBans.findIndex((b) => b === null);
        if (idx !== -1) {
          const updated = [...blueBans];
          updated[idx] = champion;
          setBlueBans(updated);
        }
      } else {
        const idx = redBans.findIndex((b) => b === null);
        if (idx !== -1) {
          const updated = [...redBans];
          updated[idx] = champion;
          setRedBans(updated);
        }
      }
    }

    setTurnIndex((prev) => prev + 1);
  };

  // 시간 초과 시 스킵
  const handleSkip = () => {
    setTurnIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.banpickContainer}>
      {/* 블루팀 */}
      <TeamSlot team="blue" picks={bluePicks} bans={blueBans} />

      {/* 중앙 챔피언 선택 */}
      <div>
        <TurnTimer timeLeft={timeLeft} />
        <ChampionSelect champions={champions} onSelect={handleSelectChampion} />
      </div>

      {/* 레드팀 */}
      <TeamSlot team="red" picks={redPicks} bans={redBans} />
    </div>
  );
};

export default GameBanPickPage;
