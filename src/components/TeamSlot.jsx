import React from "react";
import styles from "../styles/TeamSlot.module.css";

const TeamSlot = ({ team, picks, bans }) => {
  const renderSlot = (champion, index) => {
    const imgUrl = champion?.image;
    return (
      <div
        className={`${styles.slot} ${team === "blue" ? styles.blueSlot : styles.redSlot}`}
        key={index}
      >
        {imgUrl ? <img src={imgUrl} alt={champion.name} /> : <div className={styles.emptySlot}></div>}
      </div>
    );
  };

  return (
    <div className={styles[`team-${team}`]}>
      <div className={styles.teamName}>{team === "blue" ? "블루팀" : "레드팀"}</div>
      <div className={styles.picks}>{picks.map(renderSlot)}</div>
      <div className={styles.bans}>{bans.map(renderSlot)}</div>
    </div>
  );
};

export default TeamSlot;
