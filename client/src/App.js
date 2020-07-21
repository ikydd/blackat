import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import './App.css';

class App extends Component {
  state = {
      side: "runner",
      factions: []
  };

  sideSelect = (side) => {
    this.setState({ side });
  }

  factionChange = (factions) => {
    this.setState({ factions });
  }

  render() {
    return (
      <div className="App">
        <ControlPanel factions={this.state.factions}>
          <div id="sides">
            <SideButton title='Runner' side="runner" selected={this.state.side === 'runner'} onSelect={this.sideSelect} />
            <SideButton title='Corp' side="corp" selected={this.state.side === 'corp'} onSelect={this.sideSelect} />
          </div>
          <FilterList side={this.state.side} selected={this.state.factions} onChange={this.factionChange} />
        </ControlPanel>
        <CardList side={this.state.side} factions={this.state.factions}/>
      </div>
    );
  }
}

export default App;
