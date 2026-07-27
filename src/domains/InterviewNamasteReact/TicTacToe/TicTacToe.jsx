/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./TicTacToe.css";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleWinner(squares) {
  for (const [first, second, third] of winningCombinations) {
    if (
      squares[first] &&
      squares[first] === squares[second] &&
      squares[first] === squares[third]
    ) {
      return squares[first];
    }
  }

  return null;
}

const Squares = ({ onPlayerClick, mark }) => {
  return (
    <div className={`square ${mark ?? ""}`} onClick={onPlayerClick}>
      {mark}
    </div>
  );
};

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  const onPlayerClick = (index) => {
    if (squares[index] !== null || winner) return;
    const nextSqr = [...squares];
    nextSqr[index] = player;

    const hasWon = handleWinner(nextSqr);
    setSquares(nextSqr);

    if (hasWon) {
      setWinner(hasWon);
      return;
    }

    setPlayer((currentPlayer) => (currentPlayer === "X" ? "O" : "X"));
  };

  const handleResetGame = () => {
    setSquares(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
  };

  const displayMove = () => {
    if (squares.every((sqr) => sqr !== null)) {
      return (
        <div id="winner" className="winner">
          {`Oh!! No..... Nobody won`}
        </div>
      );
    }

    return (
      <div id="statusArea" className="status">
        Next Player: <span>{player}</span>
      </div>
    );
  };

  return (
    <div className="gameBoard">
      {winner ? (
        <div id="winner" className="winner">
          {`Wohoo! Player ${winner} won the game`}
        </div>
      ) : (
        displayMove()
      )}
      <button className="reset" onClick={handleResetGame}>
        Reset
      </button>

      <div className="game-grid">
        {squares.map((square, index) => {
          return (
            <Squares
              key={index}
              mark={square}
              onPlayerClick={() => onPlayerClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TicTacToe;
