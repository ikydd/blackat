import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div className="card-tile" title={this.props.data.title}>
          <img src={this.props.data.imagesrc} alt={this.props.data.title} />
      </div>
    );
  }
}

export default Card;
