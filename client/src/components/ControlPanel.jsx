import React, { useState } from 'react';
import Icon from './Icon';
import './ControlPanel.css';

const ControlsToggle = ({ closed, onClick }) => {
  const action = closed ? 'Show' : 'Hide';
  const text = `${action} Filters`;
  const icon = closed ? 'core' : 'core';
  return (
    <div id="controls-toggle" className="mobile-only">
      <button
        title={text}
        aria-label={text}
        aria-expanded={!closed}
        aria-controls="filters-wrapper"
        className={closed ? 'closed' : 'open'}
        onClick={onClick}
      >
        <div className="icon">
          <Icon code={icon} />
        </div>
        <div className="action">
          <span>{action}</span>
        </div>
      </button>
    </div>
  );
};

const ControlPanel = ({ children }) => {
  const [closed, setClosed] = useState(false);
  return (
    <div id="control-panel">
      <h2 className="sr-only">Card Filter Controls</h2>
      <ControlsToggle closed={closed} onClick={() => setClosed(!closed)} />
      <div id="filters-wrapper" className={closed && 'closed'}>
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
