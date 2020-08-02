import React, { Component } from 'react';
import Card from './Card';
import { getData } from '../helpers/api';
import './CardList.css';

const typeOrder = ['identity', 'program', 'hardware', 'resource',
  'event', 'agenda', 'ice', 'asset', 'upgrade', 'operation'];

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

  compare = (a, b) => {
    return a > b
      ? 1
      : (a < b
        ? -1
        : 0)
  }

  getFactionForSort = ({ faction }) => {
    return faction.search('neutral') !== -1 ? 'zzzzzz' : faction;
  }

  sort = (type, a, b, result = 0) => {
    if (result !== 0) {
      return result;
    }
    switch (type) {
      case 'type':
        return this.compare(typeOrder.indexOf(a.type), typeOrder.indexOf(b.type));
      case 'faction':
        return this.compare(this.getFactionForSort(a), this.getFactionForSort(b));
      case 'alpha':
      default:
        return this.compare(a.title, b.title);
    }
  }

  sequencedSort = (type) => (a, b) => {
    switch (type) {
      case 'faction':
      default:
        let result = this.sort('faction', a, b);
        result = this.sort('type', a, b, result);
        return this.sort('alpha', a, b, result);
    }
  }

  filter = cards => cards
      .filter(this.filterBySide)
      .filter(this.filterByTitleSearch)
      .filter(this.filterByTextSearch)
      .filter(this.filterByFactions)
      .filter(this.filterByTypes)
      .filter(this.filterByPacks)
      .sort(this.sequencedSort(this.props.sort))

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards).map((data, index) => (
        <Card key={index} data={data} />
      ))}</div>
    );
  }
}

export default CardList;
