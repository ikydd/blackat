import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  show() {
    return this.props.data.show === false ? '' : ' show';
  }

  hide() {
    return this.props.data.show === false ? 'hidden' : false;
  }

  render() {
    const { data: { title, code } } = this.props;
    return (
      <div className={"card-tile" + this.show()} title={title} hidden={this.hide()} >
          <img src={'/img/cards/' + code + '.png'} alt={title}/>
      </div>
    );
  }
}

export default Card;
