import React from 'react';
import './Card.css';

const hideCard = (show) => (show === false ? 'hidden' : false);

const Card = ({ data: { title, imagesrc, show, code }, focusHandler, focus }) => {
  let aboutToFocus;
  return (
    <div
      className={`card-tile${show ? ' visible-card' : ''}${focus ? ' focused-card' : ''}`}
      title={title}
      hidden={hideCard(show)}
    >
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
