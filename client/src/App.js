import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import SmallPrint from './components/SmallPrint';
import './App.css';

class App extends Component {
  state = {
      side: "runner",
      factions_runner: [],
      factions_corp: [],
      types_runner: [],
      types_corp: [],
      packs_runner: [],
      packs_corp: []
  };

  setSide = (side) => {
    this.setState({ side });
  }

  getSide = () => {
    return this.state.side;
  }

  getFilter = (type, side = null) => {
    const currentSide = side || this.getSide();
    return this.state[`${type}_${currentSide}`];
  }

  setFilter = (type, items, side = null) => {
    const currentSide = side || this.getSide();
    this.setState({ [`${type}_${currentSide}`]: items });
  }

  filterHandler = (type) => (items) => this.setFilter(type, items);

  render() {
    const filters = [
      {
        title: 'Factions',
        keyword: 'factions'
      },
      {
        title: 'Types',
        keyword: 'types'
      },
      {
        title: 'Packs',
        keyword: 'packs'
      }
    ];

    return (
      <div className="App">
        <ControlPanel>
          <div id="sides">
            <SideButton title='Runner' side="runner" selected={this.getSide() === 'runner'} onSelect={this.setSide} />
            <SideButton title='Corp' side="corp" selected={this.getSide() === 'corp'} onSelect={this.setSide} />
          </div>
          {filters.map(({ title, keyword }) => (
            <FilterList key={keyword} title={title} endpoint={keyword} side={this.getSide()} selected={this.getFilter(keyword)} onChange={this.filterHandler(keyword)} />
          ))}
          <SmallPrint/>
        </ControlPanel>
        <CardList side={this.getSide()} factions={this.getFilter('factions')} types={this.getFilter('types')} packs={this.getFilter('packs')}/>
      </div>
    );
  }
}

export default App;
