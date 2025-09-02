import React from 'react';
import './Card.css';

const Card = ({ data: { title, imagesrc } }) => {
  return (
    <div className="card-tile" tabIndex="0" title={title}>
      <img loading="lazy" src={imagesrc} alt={title} />
    </div>
  );
};

export default Card;
