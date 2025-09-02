import React from 'react';
import Icon from './Icon';

const Reset = ({ onClick }) => (
  <div id="reset" className="filter-addendum">
    <button onClick={onClick}>
      <Icon code="core" />
      Reset Settings
    </button>
  </div>
);

export default Reset;
