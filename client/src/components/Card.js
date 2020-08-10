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
    const { data: { title, imagesrc } } = this.props;
    return (
      <div className={"card-tile" + this.show()} title={title} hidden={this.hide()} >
          <img src={imagesrc} alt={title}/>
      </div>
    );
  }
}

export default Card;
