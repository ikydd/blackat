import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import './App.css';

class App extends Component {
  state = {
      side: "runner",
      factions_runner: [],
      factions_corp: []
  };

  setSide = (side) => {
    this.setState({ side });
  }

  getSide = () => {
    return this.state.side;
  }

  setFactions = (factions, side = null) => {
    const currentSide = side || this.getSide();
    this.setState({ [`factions_${currentSide}`]: factions });
  }

  getFactions = (side = null) => {
    const currentSide = side || this.getSide();
    return this.state[`factions_${currentSide}`];
  }

  render() {
    return (
      <div className="App">
        <ControlPanel>
          <div id="sides">
            <SideButton title='Runner' side="runner" selected={this.getSide() === 'runner'} onSelect={this.setSide} />
            <SideButton title='Corp' side="corp" selected={this.getSide() === 'corp'} onSelect={this.setSide} />
          </div>
          <FilterList side={this.getSide()} selected={this.getFactions()} onChange={this.setFactions} />
        </ControlPanel>
        <CardList side={this.getSide()} factions={this.getFactions()}/>
      </div>
    );
  }
}

export default App;
