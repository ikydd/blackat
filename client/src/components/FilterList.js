import React, { Component } from 'react';
import { call } from '../helpers/api';
import './FilterList.css';

class Checklist extends Component {

  state = {
      options: [],
      selected: this.props.selected || []
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

  isSelected = (faction) => {
    return this.state.selected.includes(faction.code);
  }

  change = faction => () => {
    let selected = this.state.selected;
    if (this.state.selected.includes(faction.code)) {
       selected = this.state.selected.filter(item => item !== faction.code)
    } else {
      selected = this.state.selected.concat(faction.code);
    }

    this.setState({ selected });
    this.props.onChange(selected);
  }

  render() {
    return (
      <div id="factions">
        <header>Factions</header>
        {this.state.options.filter(this.filterBySide).map((faction) => (
        <div key={faction.code} >
          <label htmlFor={'faction-filter-' + faction.code}><input type="checkbox" id={'faction-filter-' + faction.code} name={faction.code} value={faction.code} checked={this.isSelected(faction)} onChange={this.change(faction)} /> {faction.name}</label>
        </div>
      ))}</div>
    );
  }
}

export default Checklist;
