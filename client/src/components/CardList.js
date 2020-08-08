import React, { Component } from 'react';
import CardSection from './CardSection';
import { getData } from '../helpers/api';
import filter from '../helpers/filters';
import group from '../helpers/group';
import sort from '../helpers/sort';
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
    sort: () => {},
    group: () => () => {}
  }

  toCodes = ({ code }) => code;

  handleData = ([cards, factions, types, packs]) => this.setState({
    cards,
    sort: sort({ types, packs, factions }),
    group: group({ factions })
  })

  componentDidMount() {
    Promise.all([getData('cards'), getData('factions'), getData('types'), getData('packs')])
      .then(this.handleData)
      .catch(err => console.log(err));
  }

  resetDisplay = (card) => {
    card.show = true;
    return card;
  }

  filter = cards => cards
      .map(this.resetDisplay)
      .filter(filter.bySide(this.props.side))
      .filter(filter.byTitle(this.props.titleSearch))
      .filter(filter.byText(this.props.textSearch))
      .filter(filter.byFactions(this.props.factions))
      .filter(filter.byTypes(this.props.types))
      .filter(filter.byPacks(this.props.packs))
      .filter(filter.bySubtypes(this.props.subtypes));

  render() {
    const { sort, group } = this.state;
    return (
      <div id="cards">{Object.values(this.filter(this.state.cards)
          .sort(sort(this.props.sort))
          .reduce(group(this.props.sort), {}))
          .map((section, index) => (<CardSection key={index} section={section}></CardSection>))}
      </div>
    );
  }
}

export default CardList;
