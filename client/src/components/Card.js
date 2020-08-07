import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  show() {
    return this.props.data.show !== false ? ' show' : ''
  }

  hide() {
    return this.props.data.show !== false ? false : 'hidden'
  }

  render() {
    return (
      <div className={"card-tile" + this.show()} title={this.props.data.title} hidden={this.hide()} >
          <img src={'/img/cards/' + this.props.data.code + '.png'} alt={this.props.data.title}/>
      </div>
    );
  }
}

export default Card;
