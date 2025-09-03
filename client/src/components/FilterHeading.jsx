import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const FilterHeading = ({ title, inUse, onClick, controls, expanded = false }) => {
  const tooltip = `Filter by ${title}${inUse ? ' (some filters currently selected)' : ''}`;
  return (
    <button
      className="filter-heading"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      title={tooltip}
      aria-label={tooltip}
    >
      <h3>
        {title} {<FilterNotification on={inUse} />}
      </h3>
    </button>
  );
};

export default FilterHeading;
