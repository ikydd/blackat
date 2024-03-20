import React, { useState } from 'react';
import Icon from './Icon';
import './ControlPanel.css';

const ControlPanel = ({ children }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div id="control-panel">
      <h2 className="sr-only">Card Filter Controls</h2>
      <div id="filters" className={hidden ? 'closed' : ''}>
        {children}
      </div>
      <div id="addendum" className={hidden ? 'closed' : ''}>
        <p>
          <a href="#small-print">Small print</a>
        </p>
      </div>
      <div className="mobile-only">
        <button
          id="control-display-toggle"
          aria-expanded={!hidden}
          aria-controls="filters"
          className={hidden ? 'closed' : 'open'}
          onClick={() => setHidden(!hidden)}
        >
          <Icon code="click" /> {hidden ? 'Show' : 'Hide'} Controls
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
