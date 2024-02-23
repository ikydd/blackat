import React from 'react';
import Header from './Header';
import './ControlPanel.css';

const ControlPanel = ({ children }) => (
  <div id="control-panel">
    <Header />
    <div id="filters">{children}</div>
  </div>
);

export default ControlPanel;
