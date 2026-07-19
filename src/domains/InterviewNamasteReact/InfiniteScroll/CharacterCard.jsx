/* eslint-disable react/prop-types -- project doesn't use PropTypes/TS on this component tier */
import React from "react";

// Purely presentational - the sentinel div (not a card) is what the
// IntersectionObserver watches, so this component needs no ref.
const CharacterCard = ({ character }) => {
  const { image, name, status, species } = character;

  return (
    <div className="character-card">
      {/* Flex child #1: image */}
      <div className="character-card__media">
        <img src={image} alt={name} loading="lazy" />
      </div>

      {/* Flex child #2: text info, stacked column-wise */}
      <div className="character-card__info">
        <h3 className="character-card__name">{name}</h3>
        <p className="character-card__status">
          <span
            className={`status-dot status-dot--${status.toLowerCase()}`}
            aria-hidden="true"
          />
          {status}
        </p>
        <p className="character-card__species">{species}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
