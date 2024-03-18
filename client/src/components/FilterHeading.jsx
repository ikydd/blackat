import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const FilterHeading = ({ title, inUse, onClick }) => (
  <button className="filter-list-title" onClick={onClick}>
    {title} {<FilterNotification on={inUse} />}
  </button>
);

export default FilterHeading;
