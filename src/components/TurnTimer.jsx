import React, { useState, useEffect } from "react";

const TurnTimer = ({ time = 30, onTimeout }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeout) onTimeout();
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, onTimeout]);

  return (
    <div style={{ fontSize: "1.5rem", margin: "10px", textAlign: "center" }}>
      남은 시간: {seconds}초
    </div>
  );
};

export default TurnTimer;
