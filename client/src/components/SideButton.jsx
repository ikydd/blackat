import React from 'react';
import './SideButton.css';

const SideButton = ({ title, selected, side, onSelect }) => {
  const select = () => {
    if (!selected) {
      onSelect(side);
    }
  };

  const label = `${title}${selected ? ' (selected)' : ''}`;

  return (
    <button
      aria-label={label}
      title={label}
      className={`side-button${selected ? ' selected' : ''}`}
      onClick={select}
    >
      {title}
    </button>
  );
};

export default SideButton;
