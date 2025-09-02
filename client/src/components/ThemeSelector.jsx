import React, { useState } from 'react';

const Sun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="currentcolor"
      d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5Zm1-13V1c0-.55-.45-1-1-1s-1,.45-1,1v3c0,.55,.45,1,1,1s1-.45,1-1Zm0,19v-3c0-.55-.45-1-1-1s-1,.45-1,1v3c0,.55,.45,1,1,1s1-.45,1-1ZM5,12c0-.55-.45-1-1-1H1c-.55,0-1,.45-1,1s.45,1,1,1h3c.55,0,1-.45,1-1Zm19,0c0-.55-.45-1-1-1h-3c-.55,0-1,.45-1,1s.45,1,1,1h3c.55,0,1-.45,1-1ZM6.71,6.71c.39-.39,.39-1.02,0-1.41l-2-2c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l2,2c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Zm14,14c.39-.39,.39-1.02,0-1.41l-2-2c-.39-.39-1.02-.39-1.41,0s-.39,1.02,0,1.41l2,2c.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Zm-16,0l2-2c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-2,2c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29ZM18.71,6.71l2-2c.39-.39,.39-1.02,0-1.41s-1.02-.39-1.41,0l-2,2c-.39,.39-.39,1.02,0,1.41,.2,.2,.45,.29,.71,.29s.51-.1,.71-.29Z"
    />
  </svg>
);

const Moon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="currentcolor"
      d="M22.386,12.003c-.402-.167-.871-.056-1.151,.28-.928,1.105-2.506,1.62-4.968,1.62-3.814,0-6.179-1.03-6.179-6.158,0-2.397,.532-4.019,1.626-4.957,.33-.283,.439-.749,.269-1.149-.17-.401-.571-.655-1.015-.604C5.285,1.573,1,6.277,1,11.978c0,6.062,4.944,10.993,11.022,10.993,5.72,0,10.438-4.278,10.973-9.951,.042-.436-.205-.848-.609-1.017Z"
    />
  </svg>
);

const setPageTheme = (theme) => {
  const root = document.querySelector('html');
  if (theme === 'light') {
    localStorage.removeItem('theme');
    root.classList.remove('dark');
  } else {
    localStorage.setItem('theme', 'dark');
    root.classList.add('dark');
  }
};

const getOtherTheme = (theme) => (theme === 'dark' ? 'light' : 'dark');

const DarKModeControl = () => {
  const [currentTheme, setTheme] = useState(localStorage.getItem('theme'));

  const newTheme = getOtherTheme(currentTheme);

  const updateTheme = (theme) => {
    setTheme(theme);
    setPageTheme(theme);
  };

  return (
    <div id="theme-selector" className="filter-addendum">
      <button title={`Switch to ${newTheme} theme`} onClick={() => updateTheme(newTheme)}>
        {currentTheme === 'dark' ? <Sun /> : <Moon />} Change Theme
      </button>
    </div>
  );
};

export default DarKModeControl;
