import React, { Component } from 'react';
import Divider from './Divider';
import Card from './Card';
import './CardSection.css';

class CardSection extends Component {
    render() {
        const { info, cards } = this.props.section;
        return (
            <div id={info ? info.code + '-section' : 'default-section'}>
                {info ? (<Divider name={info.name} code={info.code}></Divider>) : ''}
                {cards.map((card, index) => (<Card key={index} data={card} />))}
                &nbsp;
            </div>
        );
    }
}

export default CardSection;
