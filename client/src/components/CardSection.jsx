import React from 'react';
import Divider from './Divider';
import Card from './Card';
import './CardSection.css';

const versionControl = (last, current) => {
  let showing = current.show !== false;
  if (showing && last && last.title === current.title) {
    last.show = false;
  }
  return showing ? current : last;
};

const CardSection = ({ section: { info, cards, show } }) => {
  let lastCard;
  return (
    <div
      id={info ? info.code + '-section' : 'default-section'}
      hidden={show === false ? 'hidden' : false}
    >
      {info ? <Divider name={info.name} code={info.code}></Divider> : ''}
      {cards.map((card, index) => {
        lastCard = versionControl(lastCard, card);
        return <Card key={index} data={card} />;
      })}
    </div>
  );
};

export default CardSection;
