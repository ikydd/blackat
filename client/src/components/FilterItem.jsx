import React from "react";
import Icon from "./Icon";

const FilterItem = ({ item, keyword, onChange }) => (
  <div className="checkbox">
    <label htmlFor={`${keyword}-filter-${item.code}`}>
      <input
        type="checkbox"
        id={`${keyword}-filter-${item.code}`}
        name={item.code}
        value={item.code}
        checked={item.selected}
        onChange={onChange(item)}
      />
      &nbsp; <Icon code={item.code} /> {item.name}
    </label>
  </div>
);

export default FilterItem;
