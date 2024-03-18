import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const FilterHeading = ({ title, inUse, onClick, controls, expanded = false }) => (
  <button
    className="filter-heading"
    onClick={onClick}
    aria-expanded={expanded}
    aria-controls={controls}
    aria-label={`${title}${inUse ? ' (some controls selected)' : ''}`}
  >
    {title} {<FilterNotification on={inUse} />}
  </button>
);

export default FilterHeading;
