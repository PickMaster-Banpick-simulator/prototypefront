import React from "react";
import styles from "../styles/ChampionSelect.module.css";

const ChampionSelect = ({ champions, onSelect, selectedChampions }) => {
  return (
    <div className={styles.championGrid}>
      {champions.map((champ) => {
        const isDisabled = selectedChampions?.includes(champ.name);
        return (
          <button
            key={champ.name}
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelect(champ)}
            className={isDisabled ? styles.disabledButton : styles.championButton}
          >
            <img src={champ.image} alt={champ.name} />
            <div className={styles.championName}>{champ.name}</div>
          </button>
        );
      })}
    </div>
  );
};

export default ChampionSelect;
