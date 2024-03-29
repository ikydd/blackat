import React from 'react';
import Divider from './Divider';
import Card from './Card';
import './CardSection.css';

const versionControl = (last, current, art = 'updated') => {
  const showing = current.show !== false;
  const duplicate = showing && last && last.show !== false && last.title === current.title;
  if (duplicate) {
    if (art === 'original') {
      // eslint-disable-next-line no-param-reassign
      current.show = false;
      return last;
    }
    if (art === 'updated') {
      // eslint-disable-next-line no-param-reassign
      last.show = false;
      return current;
    }
  }
  return showing ? current : last;
};

const CardSection = ({
  section: { info, cards, show },
  art,
  focusHandler = () => {},
  currentFocus
}) => {
  let lastCard;
  return (
    <div
      id={info ? `${info.code}-section` : 'default-section'}
      hidden={show === false ? 'hidden' : false}
      className="card-section"
    >
      {info ? <Divider name={info.name} code={info.icon || info.code}></Divider> : ''}
      <div className="card-section-container">
        {cards.map((card, index) => {
          lastCard = versionControl(lastCard, card, art);
          return (
            <Card
              key={index}
              data={card}
              focusHandler={focusHandler}
              focus={currentFocus === card.code}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardSection;
