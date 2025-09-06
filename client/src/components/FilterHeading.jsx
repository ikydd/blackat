import React from 'react';
import FilterNotification from './FilterNotification';
import './FilterHeading.css';

const Chevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M9,17.879V6.707A1,1,0,0,1,10.707,6l5.586,5.586a1,1,0,0,1,0,1.414l-5.586,5.586A1,1,0,0,1,9,17.879Z" />
  </svg>
);

const FilterHeading = ({ title, inUse, onClick, controls, expanded = false }) => {
  const tooltip = `${title}${inUse ? ' (some filters currently selected)' : ''}`;
  return (
    <button
      className="filter-heading"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      title={tooltip}
      aria-label={tooltip}
    >
      <h3 className={expanded ? 'expanded' : ''}>
        <Chevron /> {title} {<FilterNotification on={inUse} />}
      </h3>
    </button>
  );
};

export default FilterHeading;
