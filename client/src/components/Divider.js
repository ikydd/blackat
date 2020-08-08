import React, { Component } from 'react';
import Icon from './Icon';
import './Divider.css';

class Divider extends Component {
    render() {
        const { name, code } = this.props;
        return (
            <h3 role="separator" className="card-divider">{name} <Icon code={code}/></h3>
        )
    }
}

export default Divider;
