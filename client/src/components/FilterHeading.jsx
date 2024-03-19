import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const FilterHeading = ({ title, inUse, onClick, controls, expanded = false }) => (
  <button
    className="filter-heading"
    onClick={onClick}
    aria-expanded={expanded}
    aria-controls={controls}
    aria-label={`Filter by ${title}${inUse ? ' (some controls selected)' : ''}`}
  >
    <h3>
      {title} {<FilterNotification on={inUse} />}
    </h3>
  </button>
);

export default FilterHeading;
