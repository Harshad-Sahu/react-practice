import React, { useEffect, useRef, useState } from "react";
import "./ReactTimer.css";

const formatTime = (totalTime) => {
  const min = Math.floor(totalTime / 60);
  const sec = totalTime % 60;

  return {
    minutes: String(min).padStart(2, "0"),
    seconds: String(sec).padStart(2, "0"),
  };
};

const ReactTimer = () => {
  const [min, setMin] = useState(null);
  const [sec, setSec] = useState(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(0);

  const { minutes, seconds } = formatTime(remainingSec);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    setIsRunning(true);
  };

  const handleStart = () => {
    const totalSec = Number(min) * 60 + Number(sec);
    if (totalSec <= 0) {
      return;
    }

    setRemainingSec(totalSec);
    startTimer();
  };

  const handlePauseResume = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else if (remainingSec > 0) {
      startTimer();
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    setMin(null);
    setSec(null);
    setRemainingSec(0);
    setIsRunning(false);
  };

  return (
    <div className="react-timer-container">
      <div className="controllers">
        <div className="form-field">
          <label htmlFor="minutes">Minutes:</label>
          <input
            type="text"
            id="minutes"
            name="minutes"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Please enter minutes"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="seconds">Seconds:</label>
          <input
            type="text"
            id="seconds"
            name="seconds"
            value={sec}
            onChange={(e) => setSec(e.target.value)}
            placeholder="Please enter seconds"
            max="60"
            min="0"
            required
          />
        </div>

        <button className="btn" onClick={handleStart}>
          START
        </button>
        <button className="btn" onClick={handlePauseResume}>
          {isRunning ? "PAUSE" : "RESUME"}
        </button>
        <button className="btn" onClick={handleReset}>
          RESET
        </button>
      </div>

      <div className="display-container">
        <h4>{`Time: ${minutes}:${seconds}`}</h4>
      </div>
    </div>
  );
};

export default ReactTimer;
