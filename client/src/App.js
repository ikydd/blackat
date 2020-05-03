import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = { side: "runner"};
  }

  sideSelect = (side) => {
    this.setState({ side })
  }

  render() {
    return (
      <div className="App">
        <ControlPanel onSideSelect={this.sideSelect}/>
        <CardList side={this.state.side}/>
      </div>
    );
  }
}

export default App;
