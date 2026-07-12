/* eslint-disable react/prop-types */
import React from "react";

const GridLights = ({ gridSize = 5 }) => {
  const [grid, setGrid] = React.useState(() =>
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false),
    ),
  );

  const toggleCell = (rowIndex, colIndex) => {
    setGrid((prevGrid) => {
      const nextGrid = prevGrid.map((row) => row.slice());
      const toggles = [
        [rowIndex, colIndex],
        [rowIndex - 1, colIndex],
        [rowIndex + 1, colIndex],
        [rowIndex, colIndex - 1],
        [rowIndex, colIndex + 1],
      ];

      toggles.forEach(([r, c]) => {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          nextGrid[r][c] = !nextGrid[r][c];
        }
      });

      return nextGrid;
    });
  };

  return (
    <div>
      <h1>Grid Lights</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, minmax(40px, 1fr))`,
          gap: "4px",
          maxWidth: "100%",
          width: "fit-content",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              onClick={() => toggleCell(rowIndex, colIndex)}
              style={{
                width: "100px",
                aspectRatio: "1 / 1",
                border: "1px solid #ccc",
                backgroundColor: cell ? "#ffff01" : "#d2d2d2",
                cursor: "pointer",
                padding: 0,
                margin: 0,
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default GridLights;
