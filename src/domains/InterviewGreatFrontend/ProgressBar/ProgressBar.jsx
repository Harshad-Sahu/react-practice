import React from "react";
import "./progressBar.css";

const ProgressBarComponent = () => {
  return (
    <div className="progress-container">
      <div className="progress-fill" />
    </div>
  );
};

const ProgressBar = () => {
  const [bars, setBars] = React.useState([]);

  const handleAddProgressBar = () => {
    setBars((prevBars) => [...prevBars, Date.now()]);
  };

  return (
    <div>
      <button onClick={handleAddProgressBar}>Add Progress Bar</button>
      <div className="bars">
        {bars.map((bar) => (
          <ProgressBarComponent key={bar} />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
