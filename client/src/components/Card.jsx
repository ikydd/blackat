import React from 'react';
import './Card.css';

const hideCard = (show) => (show === false ? 'hidden' : false);

const Card = ({ data: { title, imagesrc, show } }) => {
  return (
    <div className={'card-tile'} title={title} hidden={hideCard(show)}>
      <img src={imagesrc} alt={title} loading="lazy" />
    </div>
  );
};

export default Card;
