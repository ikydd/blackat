import React, { Component } from 'react';
import './SideButton.css';

class SideButton extends Component {
  select = () => {
    if (!this.props.selected) {
      this.props.onSelect(this.props.side);
    }
  }

  render() {
    const { selected, title } = this.props;
    return (
      <h4 role="button" className={"side-button" + (selected ? " selected" : "")} onClick={this.select}>{title}</h4>
    );
  }
}

export default SideButton;
