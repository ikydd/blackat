import React, { Component } from 'react';
import Card from './Card';
import './CardList.css';

class CardList extends Component {

  state = {
    cards: []
  }

  componentDidMount() {
    this.getCards()
      .then(res => this.setState({ cards: res }))
      .catch(err => console.log(err));
  }

  getCards = async() => {
    const response = await fetch('/api/cards');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  }

  render() {
    return (
      <div class="card-list">{this.state.cards.map((card, index) => (
        <Card key={index} name={card.name} img={"https://arkhamdb.com/" + card.imagesrc}/>
      ))}</div>
    );
  }
}

export default CardList;