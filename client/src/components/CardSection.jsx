import React from 'react';
import Divider from './Divider';
import Card from './Card';
import './CardSection.css';

const CardSection = ({ section: { info, cards }, tabbable }) => {
  return (
    <div id={info ? `${info.code}-section` : 'default-section'} className="card-section">
      {info ? <Divider name={info.name} code={info.icon || info.code}></Divider> : ''}
      <div className="card-section-container">
        {cards.map((card, index) => (
          <Card key={index} data={card} tabbable={tabbable} />
        ))}
      </div>
    </div>
  );
};

export default CardSection;
