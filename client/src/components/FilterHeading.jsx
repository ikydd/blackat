import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const FilterHeading = ({ title, inUse, onClick }) => (
  <h4 className="filter-list-title">
    <button onClick={onClick}>
      {title} {<FilterNotification on={inUse} />}
    </button>
  </h4>
);

export default FilterHeading;
