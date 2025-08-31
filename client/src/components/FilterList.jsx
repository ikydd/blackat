import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterHeading from './FilterHeading';
import FilterClearButton from './FilterClearButton';
import './FilterList.css';

const FilterList = ({
  closed = false,
  title = 'Missing',
  onChange,
  options = [],
  settings = [],
  clearAll
}) => {
  const [isClosed, setClosed] = useState(closed);

  const handleSelection = (item, checked) => onChange(item.code, checked);

  const items = options.map((option) => ({
    ...option,
    selected: settings.includes(option.code)
  }));

  const toggleClosed = () => {
    setClosed(!isClosed);
  };

  const inUse = items.some(({ selected }) => selected);
  const keyword = title.toLowerCase();
  const id = `filter-list-${keyword}`;

  return (
    <div className="filter-list" data-testid={`${keyword}-filters`}>
      <FilterHeading
        title={title}
        inUse={inUse}
        onClick={toggleClosed}
        controls={id}
        expanded={!isClosed}
      />
      {isClosed !== true && (
        <div id={id} className="filter-list-items">
          <FilterClearButton onClick={clearAll} />
          {items.map((item) => (
            <FilterItem key={item.code} item={item} keyword={keyword} onChange={handleSelection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterList;
