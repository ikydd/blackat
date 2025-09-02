import React from 'react';
import './Timestamp.css';

const Timestamp = ({ time }) => {
  return (
    time && (
      <div id="timestamp" className="filter-addendum">
        <p>Data updated: {time.toLocaleDateString()}</p>
      </div>
    )
  );
};

export default Timestamp;
