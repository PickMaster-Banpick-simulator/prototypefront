import React, { useState, useEffect } from "react";
import TeamSlot from "../components/TeamSlot";
import ChampionSelect from "../components/ChampionSelect";
import TurnTimer from "../components/TurnTimer";
import styles from "../styles/Banpick.module.css";

import { over } from "stompjs";
import SockJS from "sockjs-client";

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

let stompClient = null;

const GameBanPickPage = ({ gameId = 1 }) => {
  const [champions, setChampions] = useState([]);
  const [bluePicks, setBluePicks] = useState([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState([null, null, null, null, null]);
  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentTurn = BANPICK_ORDER[turnIndex];

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

  // WebSocket 연결
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/banpick/progress/${gameId}`, (msg) => {
        const progress = JSON.parse(msg.body);

        // 서버에서 내려주는 현재 상태 반영
        setBluePicks(progress.bluePicks);
        setRedPicks(progress.redPicks);
        setBlueBans(progress.blueBans);
        setRedBans(progress.redBans);
        setTurnIndex(progress.turnIndex);
      });

      stompClient.subscribe(`/topic/banpick/complete/${gameId}`, (msg) => {
        alert("밴픽 완료!");
      });

      stompClient.subscribe(`/topic/banpick/error/${gameId}`, (msg) => {
        alert("에러: " + msg.body);
      });
    });
  }, [gameId]);

  // 타이머
  useEffect(() => {
    if (!currentTurn) return;
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

  // 챔피언 선택 → 서버로 전송
  const handleSelectChampion = (champion) => {
    if (!currentTurn) return;

    const message = {
      team: currentTurn.team,
      action: currentTurn.action,
      championId: champion.id,
      championName: champion.name,
      championImage: champion.image,
    };

    stompClient.send(`/app/select/${gameId}`, {}, JSON.stringify(message));
  };

  const handleSkip = () => {
    stompClient.send(
      `/app/select/${gameId}`,
      {},
      JSON.stringify({ skip: true })
    );
  };

  const selectedChampions = [
    ...bluePicks,
    ...redPicks,
    ...blueBans,
    ...redBans,
  ].filter(Boolean);

  const getAvailableChampions = () => {
    const bannedNames = [...blueBans, ...redBans]
      .filter(Boolean)
      .map((c) => c.name);
    return champions.filter((c) => !bannedNames.includes(c.name));
  };

  return (
    <div className={styles.banpickContainer}>
      <TeamSlot team="blue" picks={bluePicks} bans={blueBans} />
      <div className={styles.centerContainer}>
        <TurnTimer timeLeft={timeLeft} />
        <p className={styles.turnInfo}>
          {currentTurn?.team.toUpperCase()}팀 {currentTurn?.action.toUpperCase()} 중
        </p>
        {champions.length ? (
          <ChampionSelect
            champions={getAvailableChampions()}
            onSelect={handleSelectChampion}
            selectedChampions={selectedChampions.map((c) => c.name)}
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
