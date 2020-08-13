import React, { Component } from 'react';
import { getData } from '../helpers/api';
import FilterItem from './FilterItem';
import FilterGroup from './FilterGroup';
import './FilterList.css';

class FilterList extends Component {

  static defaultProps = {
    title: "Missing",
    selected: []
  }

  state = {
      hidden: this.props.hidden || false,
      options: []
  }

  componentDidMount() {
    if (!this.props.dataType) {
      throw new Error('dataType prop was missing for a filter and is required');
    }
    getData(this.props.dataType)
      .then(options => this.setState({ options }))
      .catch(err => console.log(err));
  }

  filterBySide = (option) => {
    if (!this.props.side || !option.side) {
      return true;
    }
    return option.side === this.props.side;
  }

  isSelected = (item) => this.props.selected.includes(item.code);

  change = (item) => () => {
    this.props.onChange(item);
  }

  isGroupSelected = (items) => items.filter(this.isSelected).length === items.length;

  changeGroup = (currentlySelected) => (group) => () => {
    this.props.onGroupChange(group.items, !currentlySelected);
  }

  toggleHidden = () => {
    const newState = !this.state.hidden;
    this.setState({ hidden: newState });
  }

  render() {
    const keyword = this.props.title.toLowerCase();
    const { title, selected, clearAll } = this.props;
    const { hidden, options } = this.state;
    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title" onClick={this.toggleHidden}>{title} {selected.length ? <span role="alert">&bull;</span> : ""}</h4>
        <div hidden={(hidden ? 'hidden' : false)}>
          <h5 role="button" onClick={clearAll} >Clear All</h5>
          {options.filter(this.filterBySide).map((item) => {
            if (item.items && item.items.length) {
              return <FilterGroup key={item.code} item={item} keyword={keyword} selected={this.isGroupSelected(item.items)} onChange={this.changeGroup}>
                  { item.items.length > 1 ? item.items.map((item) => (<FilterItem key={item.code} item={item} keyword={keyword} selected={this.isSelected(item)} onChange={this.change} />)) : "" }
                </FilterGroup>
            } else {
              return <FilterItem key={item.code} item={item} keyword={keyword} selected={this.isSelected(item)} onChange={this.change} />
            }
          })}
        </div>
      </div>
    );
  };
}

export default FilterList;
