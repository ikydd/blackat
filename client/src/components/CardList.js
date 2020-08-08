import React, { Component } from 'react';
import CardSection from './CardSection';
import { getData } from '../helpers/api';
import filter from '../helpers/filters';
import group from '../helpers/group';
import cardSort from '../helpers/sort';
import './CardList.css';

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
    cards: [],
    factions: []
  }

  componentDidMount() {
    Promise.all([getData('cards'), getData('factions')])
      .then(([cards, factions]) => this.setState({ cards, factions }))
      .catch(err => console.log(err));
  }

  resetDisplay = (card) => {
    card.show = true;
    return card;
  }

  filter = cards => cards
      .map(this.resetDisplay)
      .map(filter.bySide(this.props.side))
      .map(filter.byTitle(this.props.titleSearch))
      .map(filter.byText(this.props.textSearch))
      .map(filter.byFactions(this.props.factions))
      .map(filter.byTypes(this.props.types))
      .map(filter.byPacks(this.props.packs))
      .map(filter.bySubtypes(this.props.subtypes))
      .sort(cardSort(this.props.sort));

  group = cards => cards;

  render() {
    const info = {
      factions: this.state.factions
    }
    return (
      <div id="cards">{Object.values(this.filter(this.state.cards)
          .reduce(group(this.props.sort, info), {}))
          .map((section, index) => (<CardSection key={index} section={section}></CardSection>))}
      </div>
    );
  }
}

export default CardList;
