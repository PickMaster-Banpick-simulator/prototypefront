import React from "react";

const TeamSlot = ({ teamName, side, picks = [], bans = [] }) => {
  return (
    <div style={{ width: "200px", textAlign: "center" }}>
      <h3 style={{ color: side === "blue" ? "blue" : "red" }}>{teamName}</h3>
      <div>
        <h4>밴</h4>
        {bans.length > 0
          ? bans.map((ban, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid gray",
                  margin: "5px",
                  height: "40px",
                  lineHeight: "40px",
                }}
              >
                {ban}
              </div>
            ))
          : [...Array(3)].map((_, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid gray",
                  margin: "5px",
                  height: "40px",
                  lineHeight: "40px",
                }}
              >
                빈 슬롯
              </div>
            ))}
      </div>
      <div>
        <h4>픽</h4>
        {picks.length > 0
          ? picks.map((pick, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid gray",
                  margin: "5px",
                  height: "40px",
                  lineHeight: "40px",
                }}
              >
                {pick}
              </div>
            ))
          : [...Array(5)].map((_, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid gray",
                  margin: "5px",
                  height: "40px",
                  lineHeight: "40px",
                }}
              >
                빈 슬롯
              </div>
            ))}
      </div>
    </div>
  );
};

export default TeamSlot;
