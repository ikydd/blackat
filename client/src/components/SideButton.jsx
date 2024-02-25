import React from 'react';
import './SideButton.css';

const SideButton = ({ title, selected, side, onSelect }) => {
  const select = () => {
    if (!selected) {
      onSelect(side);
    }
  };

  return (
    <h4 role="button" className={`side-button${selected ? ' selected' : ''}`} onClick={select}>
      {title}
    </h4>
  );
};

export default SideButton;
