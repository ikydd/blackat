import React, { Component } from 'react';
import Icon from './Icon.js';

class FilterItem extends Component {
    render() {
        const { item, keyword, onChange, child } = this.props;

        return (
          <div className="checkbox">
            <label className={child ? "indent" : ""} htmlFor={`${keyword}-filter-${item.code}`}>
              <input type="checkbox" id={`${keyword}-filter-${item.code}`} name={item.code} value={item.code} checked={item.selected} onChange={onChange(item)} />
              &nbsp; <Icon code={item.code} /> {item.name}
            </label>
          </div>
          );
    }
}

export default FilterItem;
