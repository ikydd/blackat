import React, { Component } from 'react';
import FilterItem from './FilterItem';
import FilterGroup from './FilterGroup';
import FilterNotification from './FilterNotification';
import './FilterList.css';

class NestedFilterList extends Component {

  static defaultProps = {
    title: "Missing"
  }

  state = {
      hidden: this.props.hidden || false
  }

  changeGroup = (group) => ({ target: { checked }}) => {
    this.props.onGroupChange(group, checked);
  }

  changeSubitem = (item) => ({ target: { checked }}) => {
    this.props.onSubitemChange(item, checked);
  }

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden });
  }

  inUse = () => this.props.options
    .reduce((list, group) => list.concat(group.items), [])
    .find(({ selected }) => selected);

  render() {
    const keyword = this.props.title.toLowerCase();
    const { title, clearAll, options } = this.props;
    const { hidden } = this.state;
    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title" onClick={this.toggleHidden}>{title} {<FilterNotification on={this.inUse()} />}</h4>
        <div hidden={(hidden ? 'hidden' : false)}>
          <h5 role="button" onClick={clearAll} >Clear All</h5>
          {options.map((group) =>
                <FilterGroup key={group.code} item={group} keyword={keyword} onChange={this.changeGroup}>
                  { group.items.length > 1 ? group.items.map((item) => (<FilterItem child={true} key={item.code} item={item} keyword={keyword} onChange={this.changeSubitem} />)) : "" }
                </FilterGroup>
          )}
        </div>
      </div>
    );
  };
}

export default NestedFilterList;
