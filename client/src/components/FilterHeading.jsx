import React from 'react';
import FilterNotification from './FilterNotification';

const FilterHeading = ({ title, inUse, onClick }) => (
  <h4 className="filter-list-title" onClick={onClick}>
    {title} {<FilterNotification on={inUse} />}
  </h4>
);

export default FilterHeading;
