import React, { Component } from 'react';
import Icon from './Icon';
import Card from './Card';
import './CardSection.css';

class CardSection extends Component {
    render() {
        const { info, cards } = this.props.section;
        return (
            <div id={info ? info.code + '-section' : 'default-section'}>
                {info ? (<h3 role="separator" className="card-divider">{info.name} <Icon code={info.code}/></h3>) : ''}
                {cards.map((card, index) => (<Card key={index} data={card} />))}
                &nbsp;
            </div>
        );
    }
}

export default CardSection;
