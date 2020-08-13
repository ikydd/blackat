import React, { Component } from 'react';
import FilterItem from './FilterItem';

class FilterGroup extends Component {
    render() {
        const { item, keyword, selected, onChange } = this.props;

        return (
            <div className="filter-group">
                <FilterItem item={item} keyword={keyword} selected={selected} onChange={onChange(selected)} />
                {this.props.children}
            </div>
          );
    }
}

export default FilterGroup;
