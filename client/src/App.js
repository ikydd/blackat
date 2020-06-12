import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
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
        <ControlPanel side={this.state.side} factions={this.state.factions} onSideSelect={this.sideSelect} onFactionChange={this.factionChange}/>
        <CardList side={this.state.side} factions={this.state.factions}/>
      </div>
    );
  }
}

export default App;
