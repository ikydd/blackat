import React, { Component } from 'react';
import { call } from '../helpers/api';
import './FilterList.css';

class Checklist extends Component {

  state = {
    options: []
  }

  componentDidMount() {
    call('/factions')
      .then(options => this.setState({ options }))
      .catch(err => console.log(err));
  }

  filterBySide = (option) => {
    if (!this.props.side) {
      return true;
    }
    return option.side === this.props.side;
  }

  render() {
    return (
      <div id="factions">{this.state.options.filter(this.filterBySide).map((faction) => (
        <input type="checkbox" key={faction.code} value={faction.name}/>
      ))}</div>
    );
  }
}

export default Checklist;
