import React, { useState, useEffect } from "react";

const DynamicGreetingApp = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const now = new Date();

      // Update current time
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);

      // Calculate greeting based on hour
      const hour = now.getHours();
      let greet = "";

      if (hour >= 5 && hour < 12) {
        greet = "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        greet = "Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        greet = "Good Evening";
      } else {
        greet = "Good Night";
      }

      setGreeting(greet);
    };

    // Update immediately on mount
    updateGreetingAndTime();

    // Set interval to update every second
    const interval = setInterval(updateGreetingAndTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.greeting}>{greeting}</div>
      <div style={styles.time}>{currentTime}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    fontFamily: "Consolas, 'Fira Code', monospace",
  },
  greeting: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4ec9b0",
    marginBottom: 20,
  },
  time: {
    fontSize: 32,
    color: "#569cd6",
  },
};

export default DynamicGreetingApp;
