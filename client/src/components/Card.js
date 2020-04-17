import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div className="card-tile" title={this.props.data.name}>
          <img src={'https://arkhamdb.com' + this.props.data.imagesrc} alt={this.props.data.name} />
      </div>
    );
  }
}

export default Card;