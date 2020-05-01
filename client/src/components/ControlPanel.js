import React, { Component } from 'react';
import SideButton from './SideButton';
import Header from './Header';
import './ControlPanel.css';

class ControlPanel extends Component {
  render() {
    return (
      <div id="controls">
          <Header />
          <div id="sides">
            <SideButton title='Runner' />
            <SideButton title='Corp' />
          </div>
      </div>
    );
  }
}

export default ControlPanel;
