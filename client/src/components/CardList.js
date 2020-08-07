import React, { Component } from 'react';
import Card from './Card';
import { getData } from '../helpers/api';
import filters from '../helpers/filters';
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



  filter = cards => cards
      .map(this.resetDisplay)
      .map(filters.bySide(this.props.side))
      .map(filters.byTitle(this.props.titleSearch))
      .map(filters.byText(this.props.textSearch))
      .map(filters.byFactions(this.props.factions))
      .map(filters.byTypes(this.props.types))
      .map(filters.byPacks(this.props.packs))
      .map(filters.bySubtypes(this.props.subtypes))
      .sort(cardSort(this.props.sort));

  group = cards => cards;

  render() {
    return (
      <div id="cards">{this.filter(this.state.cards)
          // .reduce((groups, data) => , [])
          .map((data, index) => (
            <Card key={index} data={data} />
          ))}
      </div>
    );
  }
}

export default CardList;
