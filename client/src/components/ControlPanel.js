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
            <SideButton title='Runner' onSelect={this.props.onSideSelect} />
            <SideButton title='Corp' onSelect={this.props.onSideSelect} />
          </div>
      </div>
    );
  }
}

export default ControlPanel;
