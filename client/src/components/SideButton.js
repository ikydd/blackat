import React, { Component } from 'react';
import './SideButton.css';

class SideButton extends Component {
  render() {
    return (
      <div className="side-button">{this.props.title}</div>
    );
  }
}

export default SideButton;
