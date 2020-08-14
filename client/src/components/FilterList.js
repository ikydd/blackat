import React, { Component } from 'react';
import FilterItem from './FilterItem';
import FilterGroup from './FilterGroup';
import FilterNotification from './FilterNotification';
import './FilterList.css';

class FilterList extends Component {

  static defaultProps = {
    title: "Missing"
  }

  state = {
      hidden: this.props.hidden || false
  }

  isSelected = (item) => this.props.selected.includes(item.code);

  change = (item) => () => {
    this.props.onChange(item);
  }

  changeGroup = (group) => () => {
    this.props.onGroupChange(group);
  }

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    const keyword = this.props.title.toLowerCase();
    const { title, clearAll, options } = this.props;
    const { hidden } = this.state;
    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title" onClick={this.toggleHidden}>{title} {<FilterNotification options={this.props.options} />}</h4>
        <div hidden={(hidden ? 'hidden' : false)}>
          <h5 role="button" onClick={clearAll} >Clear All</h5>
          {options.map((item) => {
            if (item.items && item.items.length) {
              return <FilterGroup key={item.code} item={item} keyword={keyword} onChange={this.changeGroup}>
                  { item.items.length > 1 ? item.items.map((item) => (<FilterItem child={true} key={item.code} item={item} keyword={keyword} onChange={this.change} />)) : "" }
                </FilterGroup>
            } else {
              return <FilterItem key={item.code} item={item} keyword={keyword} onChange={this.change} />
            }
          })}
        </div>
      </div>
    );
  };
}

export default FilterList;
