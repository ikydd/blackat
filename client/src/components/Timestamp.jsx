import React from 'react';
import './Timestamp.css';

const Timestamp = ({ time }) => {
  return (
    time && (
      <div id="timestamp" className="filter-addendum">
        <p>
          Data updated:{' '}
          {time.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    )
  );
};

export default Timestamp;
