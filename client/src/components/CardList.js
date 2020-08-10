import React, { Component } from 'react';
import CardSection from './CardSection';
import Loader from './Loader';
import Empty from './Empty';
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
    const { sort, group, cards, loaded } = this.state;
    let empty = true;
    return (
    <div id="cards">
      {loaded ? "" : <Loader/>}
      {Object.values(filter(cards, this.props)
          .sort(sort(this.props.sort))
          .reduce(group(this.props.sort), {}))
          .map((section, index) => {
            empty = section.show ? false : empty;
            return (<CardSection key={index} section={section}></CardSection>)
          })}
      {loaded && empty ? <Empty/> : ""}
      </div>
    );
  }
}

export default CardList;
