import React from 'react';
import './SideButton.css';

const SideButton = ({ title, selected, side, onSelect }) => {
  const select = () => {
    if (!selected) {
      onSelect(side);
    }
  };

  return (
    <button className={`side-button${selected ? ' selected' : ''}`} onClick={select}>
      {title}
    </button>
  );
};

export default SideButton;
