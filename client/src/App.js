import React, { Component } from 'react';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import TextSearch from './components/TextSearch';
import SortSelect from './components/SortSelect';
import SmallPrint from './components/SmallPrint';
import './App.css';

class App extends Component {
  state = {
      side: this.props.side || "runner",
      sort: "faction",
      search: {
        title: "",
        text: ""
      },
      factions: {
        runner: [],
        corp: []
      },
      types: {
        runner: [],
        corp: []
      },
      subtypes: {
        runner: [],
        corp: []
      },
      packs: {
        runner: [],
        corp: []
      }
  };

  setSide = (side) => {
    this.setState({ side });
  }

  getSide = () => {
    return this.state.side;
  }

  getFilter = (type, side = null) => {
    const currentSide = side || this.getSide();
    return this.state[type][currentSide];
  }

  setFilter = (type, items, side = null) => {
    const currentSide = side || this.getSide();
    const currentValues = Object.assign(this.state[type], {
        [currentSide]: items
    });
    this.setState({ [type]: currentValues });
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
  filterHandler = (type) => (items) => this.setFilter(type, items);

  render() {
    const filters = [
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

    return (
      <div className="App">
        <ControlPanel>
          <div id="sides" data-testid="sides">
            <SideButton title='Runner' side="runner" selected={this.getSide() === 'runner'} onSelect={this.setSide} />
            <SideButton title='Corp' side="corp" selected={this.getSide() === 'corp'} onSelect={this.setSide} />
          </div>
          <TextSearch placeholder="search title" onChange={this.searchHandler('title')} />
          <TextSearch placeholder="search text" onChange={this.searchHandler('text')} />
          <SortSelect onChange={this.setSort} />
          {filters.map(({ title, keyword  }) => (
            <FilterList key={keyword} title={title} hidden={true} dataType={keyword} side={this.getSide()} selected={this.getFilter(keyword)} onChange={this.filterHandler(keyword)} />
          ))}
          <SmallPrint/>
        </ControlPanel>
        <CardList side={this.getSide()} sort={this.getSort()} titleSearch={this.getSearch('title')} textSearch={this.getSearch('text')} factions={this.getFilter('factions')} types={this.getFilter('types')} subtypes={this.getFilter('subtypes')} packs={this.getFilter('packs')}/>
      </div>
    );
  }
}

export default App;
