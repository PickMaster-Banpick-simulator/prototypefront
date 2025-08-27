// components/TeamSlot.jsx
import React from "react";
import styles from "../styles/TeamSlot.module.css";

const TeamSlot = ({ team, picks, bans }) => {
  return (
    <div className={styles.teamContainer}>
      <h2 className={team === "blue" ? styles.blueTitle : styles.redTitle}>
        {team === "blue" ? "블루팀" : "레드팀"}
      </h2>

      {/* 픽 슬롯 */}
      <div className={styles.pickContainer}>
        {picks.map((champ, idx) => (
          <div key={idx} className={styles.pickSlot}>
            {champ ? (
              <img
                src={champ.image}
                alt={champ.name}
                className={styles.championImg}
              />
            ) : (
              <span className={styles.emptySlot}>Pick</span>
            )}
          </div>
        ))}
      </div>

      {/* 밴 슬롯 */}
      <div className={styles.banContainer}>
        {bans.map((champ, idx) => (
          <div key={idx} className={styles.banSlot}>
            {champ ? (
              <img
                src={champ.image}
                alt={champ.name}
                className={styles.championImg}
              />
            ) : (
              <span className={styles.emptySlot}>Ban</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSlot;
