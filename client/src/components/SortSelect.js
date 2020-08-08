import React, { Component } from 'react';
import './SortSelect.css';

class SortSelect extends Component {


    handleChange = ev => {
        ev.preventDefault();
        this.props.onChange(ev.target.value);
    }

    render() {
        return (
            <div className="form-group">
                <select className="form-control" onChange={this.handleChange}>
                    <option value="faction">Sort by Faction</option>
                    <option value="type">Sort by Type</option>
                    <option value="pack">Sort by Pack</option>
                    <option value="name">Sort by Name</option>
                </select>
            </div>
        );
    }
}


export default SortSelect;
