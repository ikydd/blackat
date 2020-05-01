import React, { Component } from 'react';
import CardList from './components/CardList';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ControlPanel />
        <CardList />
      </div>
    );
  }
}

export default App;
