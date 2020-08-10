import React, { Component } from 'react';
import './TextSearch.css';

class TextSearch extends Component {
    static defaultProps = {
        placeholder: "search",
        value: ""
    }

    handleChange = ev => {
        ev.preventDefault();
        this.props.onChange(ev.target.value);
    }

    render() {
        const { value, placeholder } = this.props;
        return (
            <div className="form-group">
                <input className="form-control" defaultValue={value} placeholder={placeholder} onInput={this.handleChange} />
            </div>
        );
    }
}


export default TextSearch;
