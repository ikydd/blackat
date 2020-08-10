import React, { Component } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
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
    loaded: false,
    cards: [],
    sort: () => {},
    group: () => () => {}
  }

  handleData = ([cards, factions, types, packs]) => this.setState({
    loaded: true,
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
    <div id="cards">
      {this.state.loaded ? "" : <Loader></Loader>}
      {Object.values(filter(cards, this.props)
          .sort(sort(this.props.sort))
          .reduce(group(this.props.sort), {}))
          .map((section, index) => (<CardSection key={index} section={section}></CardSection>))}
      </div>
    );
  }
}

export default CardList;
