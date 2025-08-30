import React from 'react';
import Icon from './Icon';
import './Reset.css';

const Reset = ({ onClick }) => (
  <div id="reset">
    <button onClick={onClick}>
      <Icon code="core" />
      Reset Filters
    </button>
  </div>
);

export default Reset;
