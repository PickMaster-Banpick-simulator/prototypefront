import React from "react";
import championsData from "../data/champions.json";

const ChampionSelect = ({ onSelect }) => {
  const championList = Object.entries(championsData); // [ [name, {line}], ... ]

  return (
    <div style={{ width: "300px", border: "1px solid gray", padding: "10px" }}>
      <h3>챔피언 선택</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {championList.map(([name, info], idx) => (
          <div
            key={idx}
            onClick={() => onSelect && onSelect(name)}
            style={{
              border: "1px solid black",
              padding: "10px",
              cursor: "pointer",
              width: "80px",
              textAlign: "center",
            }}
          >
            {name}
            <div style={{ fontSize: "0.7rem", color: "gray" }}>
              {info.line.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionSelect;
