import React, { Component } from 'react';
import './SideButton.css';

class SideButton extends Component {
  render() {
    return (
      <div className="button-side">{this.props.name}</div>
    );
  }
}

export default SideButton;
