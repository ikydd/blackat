import React, { Component } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';
import './NestedFilterList.css';

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

    const generateFilters = (options) => options.map((group) => {
      const subFilters = group.items.length > 1 &&
        <div className="filter-group-items">
          {group.items.map((item) => <FilterItem key={item.code} item={item} keyword={keyword} onChange={this.changeSubitem} />)}
        </div>;

      return <div class="filter-group" key={group.code}>
        <FilterItem item={group} keyword={keyword} onChange={this.changeGroup} />
        {subFilters}
        <hr className="filter-divider" />
      </div>
    })

    const filters = hidden !== true &&
      <div className="filter-list-items">
        <h5 role="button" onClick={clearAll} >Clear All</h5>
        {generateFilters(options)}
      </div>;

    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title" onClick={this.toggleHidden}>{title} {<FilterNotification on={this.inUse()} />}</h4>
        {filters}
      </div>
    );
  };
}

export default NestedFilterList;
