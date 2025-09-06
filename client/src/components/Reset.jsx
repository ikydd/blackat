import React from 'react';
import Icon from './Icon';

const Reset = ({ onClick }) => (
  <div id="reset" className="filter-addendum">
    <button onClick={onClick} aria-label="Reset Filters" title="Reset Filters">
      <Icon code="core" />
      Reset Filters
    </button>
  </div>
);

export default Reset;
