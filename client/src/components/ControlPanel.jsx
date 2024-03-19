import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ children }) => (
  <div id="control-panel">
    <h2 className="sr-only">Card Filter Controls</h2>
    <div id="filters">{children}</div>
  </div>
);

export default ControlPanel;
