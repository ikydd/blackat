import React, { Component } from 'react';
import './SortSelect.css';

class SortSelect extends Component {
    static defaultProps = {
        options: []
    }

    handleChange = ev => {
        ev.preventDefault();
        this.props.onChange(ev.target.value);
    }

    render() {
        return (
            <div className="form-group">
                <select className="form-control" value={this.props.default} onChange={this.handleChange}>
                    {this.props.options.map(({ title, value }) => <option key={value} value={value}>Sort by {title}</option>)}
                </select>
            </div>
        );
    }
}


export default SortSelect;
