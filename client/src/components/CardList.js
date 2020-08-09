import React, { Component } from 'react';
import CardSection from './CardSection';
import { getData } from '../helpers/api';
import filter from '../helpers/filter';
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

  handleData = ([cards, factions, types, packs]) => this.setState({
    cards,
    sort: sort({ factions, types, packs }),
    group: group({ factions, types, packs })
  })

  componentDidMount() {
    Promise.all([getData('cards'), getData('factions'), getData('types'), getData('packs')])
      .then(this.handleData)
      .catch(err => console.log(err));
  }

  render() {
    const { sort, group, cards } = this.state;
    return (
      <div id="cards">{Object.values(filter(cards, this.props)
          .sort(sort(this.props.sort))
          .reduce(group(this.props.sort), {}))
          .map((section, index) => (<CardSection key={index} section={section}></CardSection>))}
      </div>
    );
  }
}

export default CardList;
