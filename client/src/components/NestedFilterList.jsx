import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';
import './NestedFilterList.css';

const NestedFilterList = ({
  title = 'Missing',
  closed = false,
  clearAll,
  onChange,
  options = []
}) => {
  const [isClosed, setClosed] = useState(closed);

  const changeGroup =
    (group) =>
    ({ target: { checked } }) => {
      const codes = group.items.map(({ code }) => code);
      onChange(codes, checked);
    };

  const changeSubitem =
    (item) =>
    ({ target: { checked } }) => {
      onChange(item.code, checked);
    };

  const toggleClosed = () => {
    setClosed(!isClosed);
  };

  const inUse = () =>
    options.reduce((list, group) => list.concat(group.items), []).find(({ selected }) => selected);

  const keyword = title.toLowerCase();

  const generateFilters = (filterOptions) =>
    filterOptions.map((group) => {
      const subFilters = group.items.length > 1 && (
        <div className="filter-group-items">
          {group.items.map((item) => (
            <FilterItem key={item.code} item={item} keyword={keyword} onChange={changeSubitem} />
          ))}
        </div>
      );

      return (
        <div className="filter-group" key={group.code}>
          <FilterItem item={group} keyword={keyword} onChange={changeGroup} />
          {subFilters}
          <hr className="filter-divider" />
        </div>
      );
    });

  const filters = isClosed !== true && (
    <div className="filter-list-items">
      <h5 role="button" onClick={clearAll}>
        Clear All
      </h5>
      {generateFilters(options)}
    </div>
  );

  return (
    <div className="filter-list" data-testid={`${keyword}-filters`}>
      <h4 className="filter-list-title" onClick={toggleClosed}>
        {title} {<FilterNotification on={inUse()} />}
      </h4>
      {filters}
    </div>
  );
};

export default NestedFilterList;
