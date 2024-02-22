import React from "react";
import "./TextSearch.css";

const TextSearch = ({ placeholder = "search", value = "", onChange }) => {
  const handleChange = (ev) => {
    ev.preventDefault();
    onChange(ev.target.value);
  };

  return (
    <div className="form-group">
      <input
        className="form-control"
        value={value}
        placeholder={placeholder}
        onInput={handleChange}
      />
    </div>
  );
};

export default TextSearch;
