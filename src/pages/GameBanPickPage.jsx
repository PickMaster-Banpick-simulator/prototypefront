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

import { useParams } from "react-router-dom";

let stompClient = null;

const GameBanPickPage = () => {
  const { roomId } = useParams();
  const [champions, setChampions] = useState([]);
  const [bluePicks, setBluePicks] = useState([null, null, null, null, null]);
  const [redPicks, setRedPicks] = useState([null, null, null, null, null]);
  const [blueBans, setBlueBans] = useState([null, null, null, null, null]);
  const [redBans, setRedBans] = useState([null, null, null, null, null]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [blueTeamId, setBlueTeamId] = useState(null);
  const [redTeamId, setRedTeamId] = useState(null);

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
    if (!roomId) return;
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/banpick/progress/${roomId}`, (msg) => {
        const progress = JSON.parse(msg.body);

        // 서버에서 내려주는 현재 상태 반영
        setBluePicks(progress.bluePicks || [null, null, null, null, null]);
        setRedPicks(progress.redPicks || [null, null, null, null, null]);
        setBlueBans(progress.blueBans || [null, null, null, null, null]);
        setRedBans(progress.redBans || [null, null, null, null, null]);
        setTurnIndex(progress.turnIndex || 0);

        // 팀 ID가 있다면 상태에 저장
        if (progress.blueTeamId) setBlueTeamId(progress.blueTeamId);
        if (progress.redTeamId) setRedTeamId(progress.redTeamId);
      });

      stompClient.subscribe(`/topic/banpick/complete/${roomId}`, (msg) => {
        alert("밴픽 완료!");
      });

      stompClient.subscribe(`/topic/banpick/error/${roomId}`, (msg) => {
        alert("에러: " + msg.body);
      });

      // 컴포넌트 언마운트 시 연결 해제
      return () => {
        if (stompClient) {
          stompClient.disconnect();
        }
      };
    });
  }, [roomId]);

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
    if (!currentTurn || !stompClient) return;

    const currentTeamId = currentTurn.team === 'blue' ? blueTeamId : redTeamId;
    if (!currentTeamId) {
      console.error("Current team ID is not set! Cannot send message.");
      return;
    }

    const message = {
      teamId: currentTeamId,
      championId: champion.id,
      actionType: currentTurn.action.toUpperCase(), // "BAN" or "PICK"
    };

    stompClient.send(`/app/select/${roomId}`, {}, JSON.stringify(message));
  };

  const handleSkip = () => {
    if (!currentTurn || !stompClient) return;

    const currentTeamId = currentTurn.team === 'blue' ? blueTeamId : redTeamId;
    if (!currentTeamId) {
      console.error("Current team ID is not set! Cannot skip turn.");
      return;
    }

    const message = {
      teamId: currentTeamId,
      actionType: 'SKIP',
    };

    stompClient.send(
      `/app/select/${roomId}`,
      {},
      JSON.stringify(message)
    );
  };

  const selectedChampions = [
    ...bluePicks,
    ...redPicks,
    ...blueBans,
    ...redBans,
  ].filter(Boolean);

  const getAvailableChampions = () => {
    const pickedNames = [...bluePicks, ...redPicks].filter(Boolean).map((c) => c.name);
    const bannedNames = [...blueBans, ...redBans]
      .filter(Boolean)
      .map((c) => c.name);
    const unselectableNames = [...bannedNames, ...pickedNames];
    return champions.filter((c) => !unselectableNames.includes(c.name));
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
