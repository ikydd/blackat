import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
    render() {
      return (
        <div class="card-tile" title={this.props.data.name}>
            <img src={this.props.data.img} />
        </div>
      );
    }
  }
  
  export default Card;