import React, { useState } from 'react';
import './Card.css';

const hideCard = (show) => (show === false ? 'hidden' : false);

const Card = ({ data: { title, imagesrc, show } }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className={`card-tile${show ? ' visible-card' : ''}${focus ? ' focused-card' : ''}`}
      title={title}
      hidden={hideCard(show)}
    >
      <img
        src={imagesrc}
        alt={title}
        loading="lazy"
        onTouchStart={() => {
          setFocus(!focus);
        }}
      />
    </div>
  );
};

export default Card;
