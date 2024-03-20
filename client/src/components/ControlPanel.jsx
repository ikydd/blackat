import React, { useState } from 'react';
import Icon from './Icon';
import meta from '../../../package.json';
import './ControlPanel.css';

const ControlPanel = ({ children }) => {
  const [hidden, setHidden] = useState(false);
  return (
    <div id="control-panel">
      <h2 className="sr-only">Card Filter Controls</h2>
      <div id="filters" hidden={hidden}>
        {children}
      </div>
      <div id="addendum" hidden={hidden}>
        <p id="version">Version {meta.version}</p>
        <p>
          <a href="#small-print">Copyright notice</a>
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
          <Icon code="click" /> {hidden ? 'Controls' : 'Hide'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
