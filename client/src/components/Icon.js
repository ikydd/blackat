
import React, { Component } from 'react';
import './Icon.css';

class Icon extends Component {
    render () {
        return (<span className={"icon icon-" + this.props.code}></span>)
    }
}

export default Icon;
