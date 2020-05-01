import React, { Component } from 'react';
import './SideButton.css';

class SideButton extends Component {
  render() {
    return (
      <h4 className="side-button">{this.props.title}</h4>
    );
  }
}

export default SideButton;
