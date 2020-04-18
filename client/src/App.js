import React, { Component } from 'react';
import CardList from './components/CardList';
import Header from './components/Header';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <CardList />
      </div>
    );
  }
}

export default App;
