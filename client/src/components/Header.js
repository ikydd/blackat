import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
    render() {
        return (
            <div id="title">
                <h1>BlacKat</h1>
                <span id="subtitle">Netrunner Card Explorer</span>
            </div>
        );
    }
}

export default Header;
