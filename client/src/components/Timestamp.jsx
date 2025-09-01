import React from 'react';
import './Timestamp.css';

const Timestamp = ({ time }) => {
  const date = new Date(time);
  return (
    <div id="timestamp">
      <p>Last updated: {date.toLocaleDateString()}</p>
    </div>
  );
};

export default Timestamp;
