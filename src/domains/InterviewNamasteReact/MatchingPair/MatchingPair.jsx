import React, { useEffect, useState } from "react";
import "./MatchingPair.css";

const initialEmojis = ["😍", "🔥", "👑", "👏", "👋", "🙄", "👍", "😎"];

const MatchingPair = () => {
  const [cards, setCards] = useState();
  const [moves, setMoves] = useState(0);
  const [firstCard, setFirstCard] = useState(null);
  const [, setSecondCard] = useState(null);
  const [isWon, setWon] = useState(false);
  const [isLocked, setLocked] = useState(false);

  const shuffle = (array) => {
    const shuffleArray = [...array];

    for (let i = array.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [shuffleArray[i], shuffleArray[randomIndex]] = [
        shuffleArray[randomIndex],
        shuffleArray[i],
      ];
    }

    return shuffleArray;
  };

  const initializeGame = () => {
    const duplicateEmojis = [...initialEmojis, ...initialEmojis];
    const shufflesEmojis = shuffle(duplicateEmojis);

    const newCards = shufflesEmojis.map((emoji, index) => ({
      id: index,
      value: emoji,
      revealed: false,
      matched: false,
    }));

    setCards(newCards);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const resetGame = () => {
    initializeGame();
  };

  const handleClick = (card) => {
    if (
      isLocked ||
      card.revealed ||
      card.matched ||
      firstCard?.id === card.id
    ) {
      return;
    }

    setCards((prevCards) =>
      prevCards?.map((currentCard) =>
        currentCard?.id === card.id
          ? { ...currentCard, revealed: true }
          : currentCard,
      ),
    );

    if (!firstCard) {
      setFirstCard(card);
      return;
    }

    setSecondCard(card);
    setMoves((prev) => prev + 1);
    setLocked(true);

    if (firstCard.value === card.value) {
      setCards((prevCards) =>
        prevCards.map((currentCard) =>
          currentCard.id === firstCard.id || currentCard.id === card?.id
            ? { ...currentCard, matched: true }
            : currentCard,
        ),
      );

      setTimeout(() => {
        setCards((currentCards) => {
          const allMatched = currentCards.every((curr) => curr.matched);

          if (allMatched) {
            setWon(true);
          }

          return currentCards;
        });

        setFirstCard(null);
        setSecondCard(null);
        setLocked(false);
      }, 0);
    } else {
      setTimeout(() => {
        setCards((prevCard) =>
          prevCard.map((curr) =>
            curr.id === firstCard.id || curr.id === card.id
              ? { ...curr, revealed: false }
              : curr,
          ),
        );
        setFirstCard(null);
        setSecondCard(null);
        setLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="game-container">
      <h1>Matching Pair Game</h1>
      <div className="stats">
        <p>Moves: {moves}</p>
        <p>
          Matches: {cards?.filter((card) => card?.matched).length / 2} /{" "}
          {initialEmojis?.length}
        </p>
      </div>

      <div className="grid">
        {cards?.map((card) => {
          return (
            <div
              key={card?.id}
              className={`card ${
                card?.revealed || card?.matched ? "revealed" : ""
              }`}
              onClick={() => handleClick(card)}>
              {(card?.revealed || card?.matched) && card.value}
            </div>
          );
        })}
      </div>

      {isWon && <h5 className="won">You Won!</h5>}

      <button onClick={resetGame}>RESET GAME</button>
    </div>
  );
};

export default MatchingPair;
