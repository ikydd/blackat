import React  from 'react';
import './Card.css';

const showCard = (show) => show === false ? '' : ' show';

const hideCard = (show) => show === false ? 'hidden' : false;

const Card = ({ data: { title, imagesrc, show } }) => {

  return (
    <div className={"card-tile" + showCard(show)} title={title} hidden={hideCard(show)} >
        <img src={imagesrc} alt={title}/>
    </div>
  );
}

export default Card;
