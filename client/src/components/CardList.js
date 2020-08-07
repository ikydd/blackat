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
    subtypes: [],
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

  resetDisplay = (card) => {
    card.show = true;
    return card;
  }

  filterBySide = (card) => {
    if (!this.props.side) {
      return card;
    }
    if (card.side !== this.props.side) {
      card.show = false;
    }
    return card;
  }

  filterByFactions = (card) => {
    if (!this.props.factions.length) {
      return card;
    }
    if (!this.props.factions.includes(card.faction)) {
      card.show = false;
    }
    return card;
  }

  filterByTypes = (card) => {
    if (!this.props.types.length) {
      return card;
    }
    if (!this.props.types.includes(card.type)) {
      card.show = false;
    }
    return card;
  }

  filterBySubtypes = (card) => {
    if (!this.props.subtypes.length) {
      return card;
    }
    if (!this.props.subtypes.filter((subtype) => card.keywords && card.keywords.search(subtype) !== -1).length) {
      card.show = false;
    }
    return card;
  }

  filterByPacks = (card) => {
    if (!this.props.packs.length) {
      return card;
    }
    if (!this.props.packs.includes(card.pack)) {
      card.show = false;
    }
    return card;
  }

  filterByTitleSearch = (card) => {
    if (!this.props.titleSearch) {
      return card;
    }
    const regex = new RegExp(this.props.titleSearch, 'i');
    if (card.title.search(regex) < 0) {
      card.show = false;
    }
    return card;
  }

  filterByTextSearch = (card) => {
    if (!this.props.textSearch) {
      return card;
    }
    const regex = new RegExp(this.props.textSearch, 'i');
    if (card.text.search(regex) < 0) {
      card.show = false;
    }
    return card;
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
      case 'name':
      default:
        return this.compare(a.title, b.title);
    }
  }

  sequencedSort = (type) => (a, b) => {
    switch (type) {
      case 'name':
          return this.sort('name', a, b);
      case 'faction':
      default:
        let result = this.sort('faction', a, b);
        result = this.sort('type', a, b, result);
        return this.sort('name', a, b, result);
    }
  }

  filter = cards => cards
      .map(this.resetDisplay)
      .map(this.filterBySide)
      .map(this.filterByTitleSearch)
      .map(this.filterByTextSearch)
      .map(this.filterByFactions)
      .map(this.filterByTypes)
      .map(this.filterBySubtypes)
      .map(this.filterByPacks)
      .sort(this.sequencedSort(this.props.sort));

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards).map((data, index) => (
        <Card key={index} data={data} />
      ))}</div>
    );
  }
}

export default CardList;
