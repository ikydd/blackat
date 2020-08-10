import React, { Component } from 'react';
import './Empty.css';

class Empty extends Component {
    render() {
        return (
            <h3 id="no-cards" role="alert">I can't find any cards for you like that &hellip; meow!</h3>
        )
    }
}

export default Empty;
