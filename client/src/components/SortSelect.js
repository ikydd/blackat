import React, { Component } from 'react';
import './SortSelect.css';

class SortSelect extends Component {


    handleChange = ev => {
        ev.preventDefault();
        this.props.onChange(ev.currentTarget.value);
    }

    render() {
        return (
            <div className="form-group">
                <select className="form-control" onChange={this.handleChange}>
                    <option value="faction">Sort by Faction</option>
                </select>
            </div>
        );
    }
}


export default SortSelect;
