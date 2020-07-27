import React, { Component } from 'react';
import './TextSearch.css';

class TextSearch extends Component {
    static defaultProps = {
        placeholder: "search"
    }

    handleChange = ev => {
        ev.preventDefault();
        this.props.onChange(ev.currentTarget.value);
      }

    render() {
        return (
            <input placeholder={this.props.placeholder} onChange={this.handleChange} />
        );
    }
}


export default TextSearch;
