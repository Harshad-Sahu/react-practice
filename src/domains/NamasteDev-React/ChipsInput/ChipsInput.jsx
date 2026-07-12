import React, { useState } from "react";
import "./styles.css";
function ChipsInput() {
  return (
    <div className="main-container">
      <h2>Chips Input</h2>
      <input
        type="text"
        placeholder="Type a chip and press tag"
        className="input"
      />
    </div>
  );
}

export default ChipsInput;
