import React, { useEffect } from 'react';
import Icon from './Icon';
import './ExplorationMode.css';

const getOtherMode = (mode) => (mode === 'keyboard' ? 'mouse' : 'keyboard');

const capitalise = (mode) => mode.slice(0, 1).toUpperCase() + mode.slice(1);

const ExplorationMode = ({ mode = '', onChange }) => {
  const newMode = getOtherMode(mode);

  useEffect(() => {
    const checkHover = () => {
      const hoverCapable = window.matchMedia('(hover: hover)').matches;
      const setMode = hoverCapable ? mode : 'keyboard';
      onChange(setMode);
    };
    checkHover();
    window.addEventListener('resize', checkHover);
    return () => {
      window.removeEventListener('resize', checkHover);
    };
  }, []);

  return (
    <div id="exploration-selector" className="filter-addendum">
      <button title={`${capitalise(newMode)} navigation`} onClick={() => onChange(newMode)}>
        {mode === 'keyboard' ? <Icon code="click" /> : <Icon code="link" />} {capitalise(newMode)}{' '}
        Exploration
      </button>
    </div>
  );
};

export default ExplorationMode;
