import React from 'react';

const TextSearch = ({ placeholder = 'search', value = '', onChange }) => {
  const handleChange = (ev) => {
    ev.preventDefault();
    onChange(ev.target.value);
  };

  return (
    <div className="form-group">
      <input
        className="form-control"
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onInput={handleChange}
      />
    </div>
  );
};

export default TextSearch;
