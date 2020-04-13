import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div class="card-tile" title={this.props.name}>
          <img src={this.props.img} alt={this.props.name} />
      </div>
    );
  }
}

export default Card;