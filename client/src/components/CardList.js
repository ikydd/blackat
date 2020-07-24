import React, { Component } from 'react';
import Card from './Card';
import { call } from '../helpers/api';
import './CardList.css';

class CardList extends Component {
  static defaultProps = {
    factions: [],
    types: []
  }

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

  filterByFactions = (card) => {
    if (!this.props.factions.length) {
      return true;
    }
    return this.props.factions.includes(card.faction);
  }

  filterByTypes = (card) => {
    if (!this.props.types.length) {
      return true;
    }
    return this.props.types.includes(card.type);
  }

  filter = cards => cards
      .filter(this.filterBySide)
      .filter(this.filterByFactions)
      .filter(this.filterByTypes);

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards).map((card, index) => (
        <Card key={index} data={card}/>
      ))}</div>
    );
  }
}

export default CardList;
