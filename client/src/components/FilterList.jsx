import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterHeading from './FilterHeading';
import FilterClearButton from './FilterClearButton';
import './FilterList.css';

const FilterList = ({ closed = false, title = 'Missing', onChange, options = [], clearAll }) => {
  const [isClosed, setClosed] = useState(closed);

  const handleSelection = (item, checked) => onChange(item.code, checked);

  const toggleClosed = () => {
    setClosed(!isClosed);
  };

  const inUse = options.some(({ selected }) => selected);
  const keyword = title.toLowerCase();

  return (
    <div className="filter-list" data-testid={`${keyword}-filters`}>
      <FilterHeading title={title} inUse={inUse} onClick={toggleClosed} />
      {isClosed !== true && (
        <div className="filter-list-items">
          <FilterClearButton onClick={clearAll} />
          {options.map((item) => (
            <FilterItem key={item.code} item={item} keyword={keyword} onChange={handleSelection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterList;
