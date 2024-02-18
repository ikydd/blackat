import React from 'react';
import './SortSelect.css';

const SortSelect = ({
        default: defaultValue,
        options = [],
        onChange
    }) => {

    const handleChange = ev => {
        ev.preventDefault();
        onChange(ev.target.value);
    }

    return (
        <div className="form-group">
            <select className="form-control" value={defaultValue} onChange={handleChange}>
                {options.map(({ title, value }) => <option key={value} value={value}>Sort by {title}</option>)}
            </select>
        </div>
    );
}


export default SortSelect;
