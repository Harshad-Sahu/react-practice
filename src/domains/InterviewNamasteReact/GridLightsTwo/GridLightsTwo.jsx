import React, { useState } from "react";
import "./GridLightsTwo.css";

const TOTAL = 9;
const GRID_SIZE = 3;

export default function GridLightsTwo() {
  const [activeCells, setActiveCells] = useState(new Set());
  const [activationOrder, setActivationOrder] = useState([]);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleClick = (index) => {
    // Ignore click if already active or mid-deactivation sequence
    if (activeCells.has(index) || isDeactivating) return;

    const nextActive = new Set(activeCells);
    nextActive.add(index);
    setActiveCells(nextActive);

    const nextOrder = [...activationOrder, index];
    setActivationOrder(nextOrder);

    // Once all 9 are on, kick off the reverse deactivation sequence
    if (nextOrder.length === TOTAL) {
      setIsDeactivating(true);
      const reverseOrder = [...nextOrder].reverse();
      startReverseDeactivation(reverseOrder);
    }
  };

  const startReverseDeactivation = (order) => {
    // Recursive setTimeout chain — deactivates one cell per 300ms tick,
    // last-clicked cell goes first since `order` is already reversed
    const deactivateStep = (i) => {
      if (i >= order.length) {
        setIsDeactivating(false); // sequence done, unlock clicks
        return;
      }
      setTimeout(() => {
        setActiveCells((prev) => {
          const updated = new Set(prev);
          updated.delete(order[i]);
          return updated;
        });
        deactivateStep(i + 1); // schedule next removal
      }, 300);
    };
    deactivateStep(0);
  };

  const resetGrid = () => {
    setActiveCells(new Set());
    setActivationOrder([]);
    setIsDeactivating(false);
  };

  return (
    <div className="main-container">
      <h1 className="grid-title">Grid Lights</h1>

      <div className="button-section">
        <button onClick={resetGrid} data-testid="reset-btn">
          Reset Grid
        </button>
      </div>

      <div className="cinema-hall" data-testid="grid-lights">
        {Array.from({ length: GRID_SIZE }, (_, rowIdx) => (
          <div className="row" key={rowIdx}>
            {Array.from({ length: GRID_SIZE }, (_, colIdx) => {
              const index = rowIdx * GRID_SIZE + colIdx;
              return (
                <div
                  key={index}
                  className={`cell col${activeCells.has(index) ? " active" : ""}`}
                  onClick={() => handleClick(index)}
                  data-testid={`cell-${index}`}></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
