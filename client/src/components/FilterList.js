import React, { Component } from 'react';
import FilterItem from './FilterItem';
import FilterNotification from './FilterNotification';
import './FilterList.css';

class FilterList extends Component {

  static defaultProps = {
    title: "Missing"
  }

  state = {
      hidden: this.props.hidden || false
  }

  change = (item) => ({ target: { checked }}) => {
    this.props.onChange(item, checked);
  }

  toggleHidden = () => {
    this.setState({ hidden: !this.state.hidden });
  }

  inUse = () => this.props.options.find(({ selected }) => selected);

  render() {
    const keyword = this.props.title.toLowerCase();
    const { title, clearAll, options } = this.props;
    const { hidden } = this.state;

    let filters = '';
    if (hidden !== true) {
      filters = <div>
        <h5 role="button" onClick={clearAll} >Clear All</h5>
        {options.map((item) => <FilterItem key={item.code} item={item} keyword={keyword} onChange={this.change} />)}
      </div>
    }

    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title" onClick={this.toggleHidden}>{title} {<FilterNotification on={this.inUse()} />}</h4>
        {filters}
      </div>
    );
  };
}

export default FilterList;
