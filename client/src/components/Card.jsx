import React from 'react';
import './Card.css';

const Card = ({ data: { title, imagesrc, code }, focusHandler, focus }) => {
  let aboutToFocus;
  return (
    <div className={`card-tile${focus ? ' focused-card' : ''}`} title={title}>
      <img
        loading="lazy"
        src={imagesrc}
        alt={title}
        onTouchStart={() => {
          aboutToFocus = true;
        }}
        onTouchMove={() => {
          aboutToFocus = false;
        }}
        onTouchEnd={() => {
          if (aboutToFocus) {
            focusHandler(focus ? 0 : code);
          }
        }}
      />
    </div>
  );
};

export default Card;
