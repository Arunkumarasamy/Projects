import React, { useState, useEffect } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

function GradientCircularProgress({ progress }) {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="80%" stopColor="#8ce68c" />
            <stop offset="20%" stopColor="#87cdf6" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        variant="determinate"
        value={progress}
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

export default function Progress() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 3000); // Update progress every second

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setMessage("Completed!");
    } else if (progress >= 90) {
      setMessage("Almost done!");
    } else if (progress >= 50) {
      setMessage("Almost completed!");
    } else if (progress >= 20) {
      setMessage("Loading...");
    }
  }, [progress]);

  return (
    <Stack spacing={2} sx={{ flexGrow: 1, alignItems: "center" }}>
      <GradientCircularProgress progress={progress} />
      <Typography variant="h6">{message}</Typography>
    </Stack>
  );
}
