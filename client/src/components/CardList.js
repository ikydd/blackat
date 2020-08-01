import React, { Component } from 'react';
import Card from './Card';
import { getData } from '../helpers/api';
import './CardList.css';

class CardList extends Component {
  static defaultProps = {
    side: "",
    titleSearch: "",
    textSearch: "",
    factions: [],
    types: [],
    packs: []
  }

  state = {
    cards: []
  }

  componentDidMount() {
    getData('cards')
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
    const regex = new RegExp(this.props.titleSearch, 'i');
    return card.title.search(regex) !== -1;
  }

  filterByTextSearch = (card) => {
    if (!this.props.textSearch) {
      return true;
    }
    const regex = new RegExp(this.props.textSearch, 'i');
    return card.text.search(regex) !== -1;
  }

  filter = cards => cards
      .filter(this.filterBySide)
      .filter(this.filterByTitleSearch)
      .filter(this.filterByTextSearch)
      .filter(this.filterByFactions)
      .filter(this.filterByTypes)
      .filter(this.filterByPacks)

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards).map((data, index) => (
        <Card key={index} data={data} />
      ))}</div>
    );
  }
}

export default CardList;
