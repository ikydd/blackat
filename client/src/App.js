import React, { Component } from 'react';
import { getData } from './helpers/api';
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

  setStorage() {
    let storage = this.getInitialState();
    const normalFilters = ['factions', 'types', 'subtypes'];
    const nestedFilters = ['packs'];

    const { side, sort, search } = this.state;
    storage = Object.assign(storage, { side, sort, search });

    storage = normalFilters.reduce((data, type) =>
      ({ ...data,
          [type]: this.state[type]
            .filter(({ selected }) => selected)
            .map(({ code }) => code)
      }), storage)
    storage = nestedFilters.reduce((data, type) =>
    ({ ...data,
        [type]: this.state[type]
          .reduce((list, { code, selected, items }) => list.concat(
            (selected ? [code] : [])
              .concat(items
                .filter(({ selected }) => selected)
                .map(({ code }) => code)
              )), [])
    }), storage);

    localStorage.setItem('settings', JSON.stringify(storage));
  }

  unselected = (option) => ({...option, selected: false });
  nestedUnselected = (option) => ({...option, selected: false, items: option.items.map(this.unselected) });
  setNormalSelection = (storage) => (option) => ({...option,
    selected: storage.includes(option.code)
  });
  setNestedSelection = (storage) => (group) => ({...group,
    selected: storage.includes(group.code),
    items: group.items.map(this.setNormalSelection(storage))
  });

  handleData = ([factions, types, packs, subtypes]) => {
    const previousSession = this.props.storage && localStorage.getItem('settings');
    if (previousSession) {
      try {
        const storage = JSON.parse(previousSession);
        const { side, sort, search: { title, text } = {} } = storage;
        const settings = {};
        settings.side = side || undefined;
        settings.sort = sort || undefined;
        if (title || text) {
          settings.search = {};
          settings.search.title = title || this.state.search.title;
          settings.search.text = text || this.state.search.text;
        }
        settings.factions = Array.isArray(storage.factions) ? factions.map(this.setNormalSelection(storage.factions)) : factions;
        settings.types = Array.isArray(storage.types) ? types.map(this.setNormalSelection(storage.types)) : types;
        settings.subtypes = Array.isArray(storage.subtypes) ? subtypes.map(this.setNormalSelection(storage.subtypes)) : subtypes;
        settings.packs = Array.isArray(storage.packs) ? packs.map(this.setNestedSelection(storage.packs)) : packs;

        this.setState(settings);
        return;

      } catch (e) {
        console.log('Failed to load previous settings', e);
      }
    }
    this.setState({
      factions: factions.map(this.unselected),
      types: types.map(this.unselected),
      subtypes: subtypes.map(this.unselected),
      packs: packs.map(this.nestedUnselected),
    });
  }

  componentDidMount () {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(this.handleData)
      .catch(err => console.log(err));
  }

  componentDidUpdate () {
    this.setStorage()
  }

  reset = () => {
    this.setState(this.getInitialState());
  }

  setSide = (side) => {
    this.setState({ side });
  }

  getSide = () => this.state.side;

  fromCurrentSide = ({ side }) => !side || side === this.getSide();

  getOptions = (type) => this.state[type]
      .filter(this.fromCurrentSide);

  getFilter = (type) => this.state[type]
    .filter(this.fromCurrentSide)
    .reduce((filters, option) => option.items ? filters.concat(option.items) : filters.concat(option), [])
    .filter(({ selected }) => selected)
    .map(({ code }) => code);

  clearFilters = (type) => () => {
    const updatedOptions = this.state[type].map(this.setAllItems(false));

    this.setState({ [type]: updatedOptions });
  }

  clearGroupFilters = (type) => () => {
    const updatedOptions = this.state[type].map((group) => ({ ...group, selected: false, items: group.items.map(this.setAllItems(false)) }));

    this.setState({ [type]: updatedOptions });
  }

  setAllItems = (checked) => (option) => ({ ...option, selected: checked });

  setFilter = (type, item, checked) => {
    const updatedOptions = this.state[type]
      .map(this.setSingleItem(item, checked));

    this.setState({ [type] : updatedOptions });
  }

  setFilterGroup = (type, item, checked) => {
    const updatedOptions = this.state[type]
      .map((option) => option.code === item.code ? ({ ...option, selected: checked, items: item.items.map(this.setAllItems(checked)) }) : option );

    this.setState({ [type] : updatedOptions });
  }

  setFilterSubitem = (type, item, checked) => {
    const updatedOptions = this.state[type]
      .map((option) => ({...option, items: option.items.map(this.setSingleItem(item, checked)) }))
      .map((option) => ({...option, selected: !option.items.find(({ selected }) => !selected) }));

    this.setState({ [type] : updatedOptions });
  }

  setSingleItem = (item, checked) => (option) => option.code === item.code ? ({ ...option, selected: checked }) : option;

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
  filterHandler = (type) => (item, checked) => this.setFilter(type, item, checked);
  filterGroupHandler = (type) => (item, checked) => this.setFilterGroup(type, item, checked);
  filterSubitemHandler = (type) => (item, checked) => this.setFilterSubitem(type, item, checked);

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

          <FilterList title="Factions" hidden={true} options={this.getOptions("factions")} clearAll={this.clearFilters("factions")} onChange={this.filterHandler("factions")} />
          <FilterList title="Types" hidden={true} options={this.getOptions("types")} clearAll={this.clearFilters("types")} onChange={this.filterHandler("types")} />
          <FilterList title="Subtypes" hidden={true} options={this.getOptions("subtypes")} clearAll={this.clearFilters("subtypes")} onChange={this.filterHandler("subtypes")} />
          <NestedFilterList title="Packs" hidden={true} options={this.getOptions("packs")} clearAll={this.clearGroupFilters("packs")} onGroupChange={this.filterGroupHandler("packs")} onSubitemChange={this.filterSubitemHandler("packs")} />

          <Reset onClick={this.reset}/>
          <SmallPrint/>
        </ControlPanel>
        <CardList side={this.getSide()} sort={this.getSort()} titleSearch={this.getSearch('title')} textSearch={this.getSearch('text')} factions={this.getFilter('factions')} types={this.getFilter('types')} subtypes={this.getFilter('subtypes')} packs={this.getFilter('packs')}/>
      </div>
    );
  }
}

export default App;
