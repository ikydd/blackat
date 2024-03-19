import React from 'react';

const SortSelect = ({ default: defaultValue, options = [], onChange }) => {
  const handleChange = (ev) => {
    ev.preventDefault();
    onChange(ev.target.value);
  };

  return (
    <div className="form-group">
      <select
        className="form-control"
        aria-label="Sort cards"
        value={defaultValue}
        onChange={handleChange}
      >
        {options.map(({ title, value }) => (
          <option key={value} value={value}>
            Sort by {title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortSelect;
