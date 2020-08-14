import React, { Component } from 'react';
import FilterItem from './FilterItem';

class FilterGroup extends Component {
    render() {
        const { item, keyword, onChange } = this.props;

        return (
            <div className="filter-group">
                <FilterItem item={item} keyword={keyword} onChange={onChange} />
                {this.props.children}
                <hr className="filter-divider" />
            </div>
          );
    }
}

export default FilterGroup;
