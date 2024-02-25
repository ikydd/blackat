import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';

const FilterList = ({ closed = false, title = 'Missing', onChange, options = [], clearAll }) => {
  const [isClosed, setClosed] = useState(closed);

  const change =
    (item) =>
    ({ target: { checked } }) => {
      onChange(item.code, checked);
    };

  const toggleClosed = () => {
    setClosed(!isClosed);
  };

  const inUse = () => options.some(({ selected }) => selected);

  const keyword = title.toLowerCase();

  return (
    <div className="filter-list" data-testid={`${keyword}-filters`}>
      <h4 className="filter-list-title" onClick={toggleClosed}>
        {title} {<FilterNotification on={inUse()} />}
      </h4>
      {isClosed !== true && (
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
