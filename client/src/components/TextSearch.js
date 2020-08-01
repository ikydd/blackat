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
            <div className="form-group">
                <input className="form-control" placeholder={this.props.placeholder} onChange={this.handleChange} />
            </div>
        );
    }
}


export default TextSearch;
