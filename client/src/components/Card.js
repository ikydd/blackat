import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    const { data: { title, code } } = this.props;
    return (
      <div className={"card-tile"} title={title}>
          <img src={'/img/cards/' + code + '.png'} alt={title}/>
      </div>
    );
  }
}

export default Card;
