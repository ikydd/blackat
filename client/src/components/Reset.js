import React, { Component } from 'react';
import './Reset.css';

class Reset extends Component {
    render() {
        return (
            <div id="reset">
                <h5 role="button" onClick={this.props.onClick}>Reset Filters</h5>
            </div>
        )
    }
}

export default Reset;
