import React from 'react';
import Icon from './Icon';
import './FilterItem.css';

const FilterItem = ({ item, keyword, onChange }) => (
  <div className="checkbox filter-item">
    <label htmlFor={`${keyword}-filter-${item.code}`}>
      <input
        type="checkbox"
        id={`${keyword}-filter-${item.code}`}
        name={item.code}
        value={item.code}
        checked={item.selected}
        onChange={(el) => onChange(item, el.target.checked)}
      />
      &nbsp; <Icon code={item.code} /> {item.name}
    </label>
  </div>
);

export default FilterItem;
