import React from 'react';
import './Reset.css';

const Reset = ({ onClick }) => (
  <div id="reset">
    <button onClick={onClick}>Reset Settings</button>
  </div>
);

export default Reset;
