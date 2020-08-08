import React, { Component } from 'react';
import Icon from './Icon';
import './Divider.css';

class Divider extends Component {
    render() {
        return (
            <h3 role="separator" className="card-divider">{this.props.name} <Icon code={this.props.code}/></h3>
        )
    }
}

export default Divider;
