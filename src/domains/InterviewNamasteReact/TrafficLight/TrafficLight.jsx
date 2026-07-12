import React, { useEffect } from "react";
import "./TrafficLight.css";

const TrafficLight = () => {
  const [activeLight, setActiveLight] = React.useState("red-light");

  useEffect(() => {
    let timeoutId;

    const scheduleNext = (currentLight) => {
      let delay;
      let nextLight;

      if (currentLight === "red-light") {
        delay = 3000;
        nextLight = "yellow-light";
      } else if (currentLight === "yellow-light") {
        delay = 1000;
        nextLight = "green-light";
      } else {
        delay = 2000;
        nextLight = "red-light";
      }

      timeoutId = window.setTimeout(() => {
        setActiveLight(nextLight);
      }, delay);
    };

    scheduleNext(activeLight);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeLight]);

  return (
    <div
      className="traffic-light-container"
      data-testid="traffic-light-container"
    >
      <h2 className="traffic-light-title" data-testid="title">
        Traffic Light
      </h2>
      <div
        className="traffic-light"
        id="traffic-light"
        data-testid="traffic-light"
      >
        <div
          className={`circle ${activeLight === "red-light" ? "red-on" : ""}`}
          id="red-light"
          data-testid="red-light"
        ></div>
        <div
          className={`circle ${activeLight === "yellow-light" ? "yellow-on" : ""}`}
          id="yellow-light"
          data-testid="yellow-light"
        ></div>
        <div
          className={`circle ${activeLight === "green-light" ? "green-on" : ""}`}
          id="green-light"
          data-testid="green-light"
        ></div>
      </div>
    </div>
  );
};

export default TrafficLight;
