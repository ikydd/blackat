import React, { Component } from 'react';
import Header from './Header';
import './ControlPanel.css';

class ControlPanel extends Component {
  render() {
    return (
      <div id="control-panel">
          <Header />
          <div id="filters">
            {this.props.children}
          </div>
      </div>
    );
  }
}

export default ControlPanel;
