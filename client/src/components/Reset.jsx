import React from 'react';
import './Reset.css';

const Reset = ({ onClick }) => (
  <div id="reset">
    <h5 role="button" onClick={onClick}>
      Reset Settings
    </h5>
  </div>
);

export default Reset;
