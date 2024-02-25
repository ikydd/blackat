import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';

const FilterList = ({ hidden = false, title = 'Missing', onChange, options = [], clearAll }) => {
  const [isHidden, setHidden] = useState(hidden);

  const change =
    (item) =>
    ({ target: { checked } }) => {
      onChange(item.code, checked);
    };

  const toggleHidden = () => {
    setHidden(!isHidden);
  };

  const inUse = () => options.some(({ selected }) => selected);

  const keyword = title.toLowerCase();

  return (
    <div className="filter-list" data-testid={`${keyword}-filters`}>
      <h4 className="filter-list-title" onClick={toggleHidden}>
        {title} {<FilterNotification on={inUse()} />}
      </h4>
      {isHidden !== true && (
        <div className="filter-list-items">
          <h5 role="button" onClick={clearAll}>
            Clear All
          </h5>
          {options.map((item) => (
            <FilterItem key={item.code} item={item} keyword={keyword} onChange={change} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterList;
