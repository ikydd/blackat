import React, { useState } from 'react';
import Icon from './Icon';
import './ControlPanel.css';

const ControlPanel = ({ children }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div id="control-panel">
      <div id="controls-toggle" className="mobile-only">
        <button
          aria-expanded={!hidden}
          aria-controls="filters"
          className={hidden ? 'closed' : 'open'}
          onClick={() => setHidden(!hidden)}
        >
          {hidden ? 'Show' : 'Hide'} Controls <Icon code="click" />
        </button>
      </div>
      <h2 className="sr-only">Card Filter Controls</h2>
      <div id="filters" className={hidden ? 'closed' : ''}>
        {children}
      </div>
      <div id="addendum" className={hidden ? 'closed' : ''}>
        <p>
          <a href="#small-print">Small print</a>
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
