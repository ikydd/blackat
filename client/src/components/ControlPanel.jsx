import React from 'react';
import meta from '../../../package.json';
import './ControlPanel.css';

const ControlPanel = ({ children }) => (
  <div id="control-panel">
    <h2 className="sr-only">Card Filter Controls</h2>
    <div id="filters">{children}</div>
    <div id="addendum">
      <p id="version">Version {meta.version}</p>
      <p>
        <a href="#small-print">Small print</a>
      </p>
    </div>
  </div>
);

export default ControlPanel;
