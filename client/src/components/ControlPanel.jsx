import React, { useState } from 'react';
import Icon from './Icon';
import './ControlPanel.css';

const ControlPanel = ({ children }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div id="control-panel">
      <h2 className="sr-only">Card Filter Controls</h2>
      <div id="controls-toggle" className="mobile-only">
        <button
          aria-expanded={!hidden}
          aria-controls="filters-wrapper"
          className={hidden ? 'closed' : 'open'}
          onClick={() => setHidden(!hidden)}
        >
          {hidden ? 'Show' : 'Hide'} Filters <Icon code="click" />
        </button>
      </div>
      <div id="filters-wrapper" className={hidden ? 'closed' : ''}>
        <div id="filters">{children}</div>
        <div id="addendum">
          <p>
            <a href="#small-print">Small print</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
