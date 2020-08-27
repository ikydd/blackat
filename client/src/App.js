import React, { Component } from 'react';
import { getData } from './helpers/api';
import * as storage from './helpers/storage';
import { filters, nestedFilters } from './helpers/controls';
import options from './helpers/options';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import NestedFilterList from './components/NestedFilterList';
import TextSearch from './components/TextSearch';
import SortSelect from './components/SortSelect';
import Reset from './components/Reset';
import SmallPrint from './components/SmallPrint';
import './App.css';

class App extends Component {

  state = storage.init({ side: this.props.side });

  componentDidMount () {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(([factions, types, packs, subtypes]) =>
        this.setState(storage.integrate(this.props.storage, { factions, types, subtypes, packs })))
      .catch(err => console.log(err));
  }

  componentDidUpdate () {
    storage.save(this.state)
  }

  reset = () => this.setState(storage.init());

  get = (prop) => this.state[prop];

  set = (prop) => (value) => this.setState({ [prop]: value })

  getOptions = (type) => filters.options(this.state[type], this.get('side'));

  getFilter = (type) => filters.get(this.state[type], this.get('side'));

  getNestedFilter = (type) => nestedFilters.get(this.state[type], this.get('side'));

  clearFilters = (type) => () =>
    this.setState({ [type]: filters.clear(this.state[type]) });

  clearGroupFilters = (type) => () =>
    this.setState({ [type]: nestedFilters.clear(this.state[type]) });

  filterHandler = (type) => (item, checked) =>
    this.setState({ [type] : filters.set(this.state[type], item, checked) });

  filterGroupHandler = (type) => (item, checked) =>
    this.setState({ [type] : nestedFilters.setGroup(this.state[type], item, checked) });

  filterSubitemHandler = (type) => (item, checked) =>
    this.setState({ [type] : nestedFilters.setItem(this.state[type], item, checked) });

  render() {
    return (
      <div className="App">
        <ControlPanel>
          <div id="sides" data-testid="sides">
            <SideButton title='Runner' side="runner" selected={this.get('side') === 'runner'} onSelect={this.set('side')} />
            <SideButton title='Corp' side="corp" selected={this.get('side') === 'corp'} onSelect={this.set('side')} />
          </div>
          <TextSearch placeholder="search title" value={this.get('title')} onChange={this.set('title')} />
          <TextSearch placeholder="search text" value={this.get('text')} onChange={this.set('text')} />
          <SortSelect options={options} default={this.state.sort} onChange={this.set('sort')} />

          <FilterList title="Factions" hidden={true} options={this.getOptions("factions")} clearAll={this.clearFilters("factions")} onChange={this.filterHandler("factions")} />
          <FilterList title="Types" hidden={true} options={this.getOptions("types")} clearAll={this.clearFilters("types")} onChange={this.filterHandler("types")} />
          <FilterList title="Subtypes" hidden={true} options={this.getOptions("subtypes")} clearAll={this.clearFilters("subtypes")} onChange={this.filterHandler("subtypes")} />
          <NestedFilterList title="Packs" hidden={true} options={this.getOptions("packs")} clearAll={this.clearGroupFilters("packs")} onGroupChange={this.filterGroupHandler("packs")} onSubitemChange={this.filterSubitemHandler("packs")} />

          <Reset onClick={this.reset}/>
          <SmallPrint/>
        </ControlPanel>
        <CardList side={this.get('side')} sort={this.get('sort')} titleSearch={this.get('title')} textSearch={this.get('text')} factions={this.getFilter('factions')} types={this.getFilter('types')} subtypes={this.getFilter('subtypes')} packs={this.getNestedFilter('packs')}/>
      </div>
    );
  }
}

export default App;
