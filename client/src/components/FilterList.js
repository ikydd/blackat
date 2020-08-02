import React, { Component } from 'react';
import { getData } from '../helpers/api';
import Icon from './Icon.js';
import './FilterList.css';

class FilterList extends Component {

  static defaultProps = {
    title: "Missing",
    selected: []
  }

  state = {
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

  isSelected = (item) => {
    return this.props.selected.includes(item.code);
  }

  change = selection => () => {
    let selected = this.props.selected;
    if (this.props.selected.includes(selection.code)) {
      selected = this.props.selected.filter(item => item !== selection.code)
    } else {
      selected = this.props.selected.concat(selection.code);
    }
    this.props.onChange(selected);
  }

  render() {
    const keyword = this.props.title.toLowerCase();
    return (
      <div className="filter-list" data-testid={keyword + '-filters'}>
        <h4 className="filter-list-title">{this.props.title}</h4>
        {this.state.options.filter(this.filterBySide).map((item) => (
        <div key={item.code} className="checkbox">
          <label htmlFor={`${keyword}-filter-${item.code}`}>
            <input type="checkbox" id={`${keyword}-filter-${item.code}`} name={item.code} value={item.code} checked={this.isSelected(item)} onChange={this.change(item)} />
            &nbsp; <Icon code={item.code}/> {item.name}
          </label>
        </div>
      ))}</div>
    );
  }
}

export default FilterList;
