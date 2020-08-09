import React, { Component } from 'react';
import Divider from './Divider';
import Card from './Card';
import './CardSection.css';

class CardSection extends Component {
    versionControl (last, card) {
        let showing = card.show !== false;
        if (showing && last && last.title === card.title) {
            last.show = false;
        }
        return showing ? card : last;
    }

    render() {
        const { info, cards, show } = this.props.section;
        let lastVisible
        return (
            <div id={info ? info.code + '-section' : 'default-section'} hidden={show === false ? 'hidden' : false} >
                {info ? (<Divider name={info.name} code={info.code}></Divider>) : ''}
                {cards.map((card, index) => {
                    lastVisible = this.versionControl(lastVisible, card);
                    return (<Card key={index} data={card} />);
                } )}
            </div>
        );
    }
}

export default CardSection;
