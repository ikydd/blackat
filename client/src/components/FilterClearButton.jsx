import React from 'react';
import './FilterClearButton.css';

const FilterClearButton = ({ onClick }) => (
  <button className="filter-clear-button" onClick={onClick}>
    Clear All
  </button>
);

export default FilterClearButton;
