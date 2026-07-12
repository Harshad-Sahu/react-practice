import React, { useState } from "react";

const PROGRESS_DURATION = 2000; // Duration in milliseconds

const ProgressBarComponent = () => {
  const [progress, setProgress] = useState(0);
  const animationRef = React.useRef(null);

  React.useEffect(
    (duration = PROGRESS_DURATION) => {
      const startTime = performance.now();

      const animateProgress = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const newProgress = Math.min((elapsedTime / duration) * 100, 100);
        setProgress(newProgress);

        if (newProgress < 100) {
          animationRef.current = requestAnimationFrame(animateProgress);
        }
      };

      animationRef.current = requestAnimationFrame(animateProgress);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    },
    [PROGRESS_DURATION],
  );

  return (
    <div className="progress-wrapper">
      <div className="progress-container">
        <div className="progress-fill" />
        <span className="progress-label">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

const ProgressBarWithPercentage = () => {
  const [bars, setBars] = useState([]);

  const handleAddProgressBar = () => {
    setBars((prevBars) => [...prevBars, crypto.randomUUID()]);
  };

  return (
    <div>
      <button onClick={handleAddProgressBar}>Add Progress Bar</button>
      <div className="bars">
        {bars.map((bar) => (
          <div key={bar} className="progress-bar-wrapper">
            <ProgressBarComponent />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBarWithPercentage;
