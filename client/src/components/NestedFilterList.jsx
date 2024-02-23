import React, { useState } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';
import './NestedFilterList.css';

const NestedFilterList = ({
  title = 'Missing',
  hidden = false,
  clearAll,
  onGroupChange,
  onSubitemChange,
  options = []
}) => {
  const [isHidden, setHidden] = useState(hidden);

  const changeGroup =
    (group) =>
    ({ target: { checked } }) => {
      onGroupChange(group, checked);
    };

  const changeSubitem =
    (item) =>
    ({ target: { checked } }) => {
      onSubitemChange(item, checked);
    };

  const toggleHidden = () => {
    setHidden(!isHidden);
  };

  const inUse = () =>
    options
      .reduce((list, group) => list.concat(group.items), [])
      .find(({ selected }) => selected);

  const keyword = title.toLowerCase();

  const generateFilters = (options) =>
    options.map((group) => {
      const subFilters = group.items.length > 1 && (
        <div className="filter-group-items">
          {group.items.map((item) => (
            <FilterItem
              key={item.code}
              item={item}
              keyword={keyword}
              onChange={changeSubitem}
            />
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

  const filters = isHidden !== true && (
    <div className="filter-list-items">
      <h5 role="button" onClick={clearAll}>
        Clear All
      </h5>
      {generateFilters(options)}
    </div>
  );

  return (
    <div className="filter-list" data-testid={keyword + '-filters'}>
      <h4 className="filter-list-title" onClick={toggleHidden}>
        {title} {<FilterNotification on={inUse()} />}
      </h4>
      {filters}
    </div>
  );
};

export default NestedFilterList;
