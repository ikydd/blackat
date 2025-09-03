import React from 'react';
import Icon from './Icon';

const FilterItem = ({ item, keyword, onChange }) => (
  <div className="checkbox filter-item">
    <label htmlFor={`${keyword}-filter-${item.code}`} title={item.name}>
      <input
        type="checkbox"
        id={`${keyword}-filter-${item.code}`}
        name={item.code}
        value={item.code}
        aria-label={item.name}
        checked={item.selected}
        onChange={(el) => onChange(item, el.target.checked)}
      />
      <Icon code={item.icon || item.code} /> {item.name}
    </label>
  </div>
);

export default FilterItem;
