import React, { Component } from 'react';
import './SideButton.css';

class SideButton extends Component {
  select = () => {
    if (!this.props.selected) {
      this.props.onSelect(this.props.code);
    }
  }

  render() {
    return (
      <h4 className={"side-button" + (this.props.selected ? " selected" : "")} onClick={this.select}>{this.props.title}</h4>
    );
  }
}

export default SideButton;
