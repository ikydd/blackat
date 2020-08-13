import React, { Component } from 'react';
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

  componentDidMount () {
    const previousSession = this.props.storage && localStorage.getItem('settings');
    if (previousSession) {
      this.setState(JSON.parse(previousSession));
    }
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

  getFilter = (type) => this.state[type]
    .filter(this.fromCurrentSide)
    .map(({ code }) => code);

  setFilter = (type, item) => {
    let selected = this.state[type];
    if (this.state[type].find(({ code }) => code === item.code)) {
      selected = this.state[type].filter(({ code }) => code !== item.code)
    } else {
      selected = this.state[type].concat(item);
    }
    this.setState({ [type] : selected });
  }

  clearAllFilters = (type) => () => {
    this.setState({ [type]: [] });
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
            <FilterList key={keyword} title={title} hidden={true} dataType={keyword} side={this.getSide()} selected={this.getFilter(keyword)} clearAll={this.clearAllFilters(keyword)} onChange={this.filterHandler(keyword)} />
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
