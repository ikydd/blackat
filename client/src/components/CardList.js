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

  render() {
    return (
      <div className="card-list">{this.state.cards.map((card, index) => (
        <Card key={index} data={card}/>
      ))}</div>
    );
  }
}

export default CardList;