import React from 'react';
import './Card.css';

const Card = ({ data: { title, imagesrc } }) => {
  let aboutToFocus;
  return (
    <div className="card-tile" tabIndex="0" title={title}>
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
        onTouchEnd={(e) => {
          if (aboutToFocus && e.target === document.activeElement.getElementsByTagName('img')[0]) {
            document.activeElement.blur();
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default Card;
