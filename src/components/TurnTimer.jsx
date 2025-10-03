import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const TurnTimer = ({ time = 30, onTimeout }) => {
  const [seconds, setSeconds] = useState(time);

  useEffect(() => {
    setSeconds(time); // Reset timer when key (e.g., turnIndex) changes
  }, [time]);

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeout) onTimeout();
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, onTimeout]);

  const progress = (seconds / time) * 100;
  const progressColor = progress > 50 ? "success" : progress > 25 ? "warning" : "error";

  return (
    <Box sx={{ width: '100%', maxWidth: 400, my: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {seconds}초 남음
      </Typography>
      <LinearProgress variant="determinate" value={progress} color={progressColor} />
    </Box>
  );
};

export default TurnTimer;
