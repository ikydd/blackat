import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div className="card-tile" title={this.props.data.name}>
          <img src={`https://netrunnerdb.com/card_image/${this.props.data.code}.png`} alt={this.props.data.name} />
      </div>
    );
  }
}

export default Card;
