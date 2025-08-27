import React from "react";
import styles from "../styles/ChampionSelect.module.css";

const ChampionSelect = ({ champions, onSelect, selectedChampions = [] }) => {
  const championList = champions && champions.data
    ? Object.values(champions.data).map((champ) => ({
        id: champ.id,
        name: champ.name,
        image: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/champion/${champ.image.full}`,
      }))
    : [];

  return (
    <div className={styles.championContainer}>
      <h3>챔피언 선택</h3>
      <div className={styles.championGrid}>
        {championList.map((champ) => {
          const isDisabled = selectedChampions.includes(champ.name);
          return (
            <div
              key={champ.id}
              className={`${styles.championCard} ${isDisabled ? styles.disabled : ""}`}
              onClick={() => !isDisabled && onSelect(champ)}
            >
              <img src={champ.image} alt={champ.name} />
              <div className={styles.championName}>{champ.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChampionSelect;
