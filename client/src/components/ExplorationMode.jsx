import React from 'react';
import Icon from './Icon';
import './ExplorationMode.css';

const getOtherMode = (mode) => (mode === 'keyboard' ? 'mouse' : 'keyboard');

const capitalise = (mode) => mode.slice(0, 1).toUpperCase() + mode.slice(1);

const ExplorationMode = ({ mode = '', onChange }) => {
  const newMode = getOtherMode(mode);

  return (
    <div id="exploration-selector" className="filter-addendum">
      <button title={`Switch to ${newMode} navigation`} onClick={() => onChange(newMode)}>
        {mode === 'keyboard' ? <Icon code="click" /> : <Icon code="link" />} {capitalise(newMode)}{' '}
        Exploration
      </button>
    </div>
  );
};

export default ExplorationMode;
