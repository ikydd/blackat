import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterHeading from './FilterHeading';
import FilterClearButton from './FilterClearButton';
import './FilterList.css';
import './NestedFilterList.css';

const NestedFilterList = ({
  title = 'Missing',
  closed = false,
  clearAll,
  onChange,
  options = [],
  settings = []
}) => {
  const [isClosed, setClosed] = useState(closed);

  const handleGroupOptionSelection = (group, checked) => {
    const codes = group.items.map(({ code }) => code);
    onChange(codes, checked);
  };

  const handleSubOptionSelection = (item, checked) => {
    onChange(item.code, checked);
  };

  const groups = options.map((option) => {
    const items = option.items.map((suboption) => ({
      ...suboption,
      selected: settings.includes(suboption.code)
    }));
    const allItemsInGroupSelected =
      items.filter(({ selected }) => selected).length === items.length;
    return {
      ...option,
      selected: allItemsInGroupSelected,
      items
    };
  });

  const toggleClosed = () => {
    setClosed(!isClosed);
  };

  const inUse = groups
    .reduce((list, group) => list.concat(group.items), [])
    .find(({ selected }) => selected);

  const keyword = title.toLowerCase();
  const id = `filter-list-${keyword}`;

  const generateFilters = (filterOptions) =>
    filterOptions.map((group) => {
      return (
        <div className="filter-group" key={group.code}>
          <FilterItem item={group} keyword={keyword} onChange={handleGroupOptionSelection} />
          {group.items.length > 1 && (
            <div className="filter-group-items">
              {group.items.map((item) => (
                <FilterItem
                  key={item.code}
                  item={item}
                  keyword={keyword}
                  onChange={handleSubOptionSelection}
                />
              ))}
            </div>
          )}
          <hr className="filter-divider" />
        </div>
      );
    });

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
          {generateFilters(groups)}
        </div>
      )}
    </div>
  );
};

export default NestedFilterList;
