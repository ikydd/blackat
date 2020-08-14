import React, { Component } from 'react';
import { getData } from './helpers/api';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import TextSearch from './components/TextSearch';
import SortSelect from './components/SortSelect';
import Reset from './components/Reset';
import SmallPrint from './components/SmallPrint';
import './App.css';

class App extends Component {
  getInitialState = () => {
    return Object.assign({}, {
      side: this.props.side || "runner",
      sort: "faction",
      search: {
        title: "",
        text: ""
      },
      factions: [],
      types: [],
      subtypes: [],
      packs: []
    });
  };

  state = this.getInitialState();

  filters = [
    {
      title: 'Factions',
      keyword: 'factions'
    },
    {
      title: 'Types',
      keyword: 'types'
    },
    {
      title: 'Subtypes',
      keyword: 'subtypes'
    },
    {
      title: 'Packs',
      keyword: 'packs'
    }
  ];

  handleData = ([factions, types, packs, subtypes]) => {
    this.setState({
      factions,
      types,
      packs,
      subtypes
    })
  }

  handleState = () => {
    const previousSession = this.props.storage && localStorage.getItem('settings');
    if (previousSession) {
      this.setState(JSON.parse(previousSession));
    }
  }

  componentDidMount () {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(this.handleData)
      .then(this.handleState)
      .catch(err => console.log(err));
  }

  componentDidUpdate () {
    localStorage.setItem('settings', JSON.stringify(this.state));
  }

  reset = () => {
    this.setState(this.getInitialState());
  }

  setSide = (side) => {
    this.setState({ side });
  }

  getSide = () => {
    return this.state.side;
  }

  fromCurrentSide = ({ side }) => !side || side === this.getSide();

  getOptions = (type) => this.state[type]
      .filter(this.fromCurrentSide);

  getFilter = (type) => {
    const filters = this.state[type]
    .filter(this.fromCurrentSide)
    .reduce((filters, option) => option.items ? filters.concat(option.items) : filters.concat(option), [])
    .filter(({ selected }) => selected)
    .map(({ code }) => code);
    return filters;
  }

  setFilter = (type, item) => {
    const updatedOptions = this.state[type]
      .map((option) => option.code === item.code ? ({ ...option, selected: !item.selected }) : option );
    this.setState({ [type] : updatedOptions });
  }

  clearAllFilters = (type) => () => {
    this.setState({ [type]: [] });
  }

  setFilterGroup = (type, item) => {
    const change = item.selected ? this.deselectAllItems : this.selectAllItems;

    const updatedOptions = this.state[type]
      .map((option) => option.code === item.code ? ({ ...option, selected: !item.selected, items: item.items.map(change) }) : option );
    this.setState({ [type] : updatedOptions });
  }


  toggleSingleItem = (item) => (option) => {
    if (option.code === item.code) {
      return { ...option, selected: !item.selected };
    }
    return option;
  }

  selectAllItems = (option) => ({ ...option, selected: true });
  deselectAllItems = (option) => ({ ...option, selected: false });

  setFilterSubitem = (type, group, item) => {
    const updatedOptions = this.state[type]
      .map((option) => option.code === group.code ? {...option, items: option.items.map(this.toggleSingleItem(item)) } : option);

    this.setState({ [type] : updatedOptions });
  }

  getSearch = (type) => {
    return this.state.search[type];
  }

  setSearch = (type, term) => {
    const currentValues = Object.assign(this.state.search, {
        [type]: term
    });
    this.setState({ search: currentValues });
  }

  getSort = () => {
    return this.state.sort;
  }

  setSort = (sort) => {
    this.setState({ sort })
  }

  searchHandler = (type) => (term) => this.setSearch(type, term);
  filterHandler = (type) => (item) => this.setFilter(type, item);
  filterGroupHandler = (type) => (item) => this.setFilterGroup(type, item);
  filterSubitemHandler = (type) => (group, item) => this.setFilterSubitem(type, group, item);

  render() {
    return (
      <div className="App">
        <ControlPanel>
          <div id="sides" data-testid="sides">
            <SideButton title='Runner' side="runner" selected={this.getSide() === 'runner'} onSelect={this.setSide} />
            <SideButton title='Corp' side="corp" selected={this.getSide() === 'corp'} onSelect={this.setSide} />
          </div>
          <TextSearch placeholder="search title" value={this.getSearch('title')} onChange={this.searchHandler('title')} />
          <TextSearch placeholder="search text" value={this.getSearch('text')} onChange={this.searchHandler('text')} />
          <SortSelect onChange={this.setSort} />
          {this.filters.map(({ title, keyword  }) => (
            <FilterList key={keyword} title={title} hidden={true} options={this.getOptions(keyword)} clearAll={this.clearAllFilters(keyword)} onChange={this.filterHandler(keyword)} onGroupChange={this.filterGroupHandler(keyword)} onSubitemChange={this.filterSubitemHandler(keyword)} />
          ))}
          <Reset onClick={this.reset}/>
          <SmallPrint/>
        </ControlPanel>
        <CardList side={this.getSide()} sort={this.getSort()} titleSearch={this.getSearch('title')} textSearch={this.getSearch('text')} factions={this.getFilter('factions')} types={this.getFilter('types')} subtypes={this.getFilter('subtypes')} packs={this.getFilter('packs')}/>
      </div>
    );
  }
}

export default App;
