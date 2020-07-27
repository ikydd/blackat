import React, { Component } from 'react';
import Card from './Card';
import { call } from '../helpers/api';
import './CardList.css';

class CardList extends Component {
  static defaultProps = {
    titleSearch: "",
    factions: [],
    types: [],
    packs: []
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

  filterByPacks = (card) => {
    if (!this.props.packs.length) {
      return true;
    }
    return this.props.packs.includes(card.pack);
  }

  filterByTitleSearch = (card) => {
    if (!this.props.titleSearch) {
      return true;
    }
    return card.title.search(this.props.titleSearch) !== -1;
  }

  filter = cards => cards
      .filter(this.filterBySide)
      .filter(this.filterByTitleSearch)
      .filter(this.filterByFactions)
      .filter(this.filterByTypes)
      .filter(this.filterByPacks)

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards).map((card, index) => (
        <Card key={index} data={card}/>
      ))}</div>
    );
  }
}

export default CardList;
