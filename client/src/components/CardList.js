import React, { Component } from 'react';
import Card from './Card';
import { call } from '../helpers/api';
import './CardList.css';

class CardList extends Component {

  state = {
    cards: []
  }

  componentDidMount() {
    call('/cards')
      .then(cards => this.setState({ cards }))
      .catch(err => console.log(err));
  }

  filterBySide = (card) => {
    if (!this.props.side) {
      return true;
    }
    return card.side === this.props.side;
  }

  render() {
    return (
      <div id="cards">{this.state.cards.filter(this.filterBySide).map((card, index) => (
        <Card key={index} data={card}/>
      ))}</div>
    );
  }
}

export default CardList;
