import React, { useState, useEffect } from 'react';
import { getData } from './helpers/api';
// import * as storage from './helpers/storage'
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

const App = ({ side: sideProp = 'runner' }) => {
  const [side, setSide] = useState(sideProp);
  const [sort, setSort] = useState('faction');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [factions, setFactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(([factions, types, packs, subtypes]) => {
        setFactions(factions.map((option) => ({ ...option, selected: false })));
        setTypes(types.map((option) => ({ ...option, selected: false })));
        setSubtypes(subtypes.map((option) => ({ ...option, selected: false })));
        setPacks(
          packs.map((option) => ({
            ...option,
            items: option.items.map((item) => ({ ...item, selected: false })),
            selected: false
          }))
        );
      })
      .catch((err) => console.log(err));
  }, []);

  // useEffect(() => {
  //   storage.save(settings)
  // }, [settings]);

  const reset = () => {
    setSide('runner');
    setSort('faction');
    setTitle('');
    setText('');
    setFactions(factions);
    setTypes(types);
    setSubtypes(subtypes);
    setPacks(packs);
  };

  const getOptions = (type) => filters.options(type, side);

  const getFilter = (type) => filters.get(type, side);

  const getNestedFilter = (type) => nestedFilters.get(type, side);

  const clearFilters = (type, setter) => () => setter(filters.clear(type));

  const clearGroupFilters = (type, setter) => () => setter(nestedFilters.clear(type));

  const filterHandler = (type, setter) => (item, checked) =>
    setter(filters.set(type, item, checked));

  const filterGroupHandler = (type, setter) => (item, checked) =>
    setter(nestedFilters.setGroup(type, item, checked));

  const filterSubitemHandler = (type, setter) => (item, checked) =>
    setter(nestedFilters.setItem(type, item, checked));

  return (
    <div className="App">
      <ControlPanel>
        <div id="sides" data-testid="sides">
          <SideButton
            title="Runner"
            side="runner"
            selected={side === 'runner'}
            onSelect={setSide}
          />
          <SideButton title="Corp" side="corp" selected={side === 'corp'} onSelect={setSide} />
        </div>
        <TextSearch placeholder="search title" value={title} onChange={setTitle} />
        <TextSearch placeholder="search text" value={text} onChange={setText} />
        <SortSelect options={options} default={sort} onChange={setSort} />

        <FilterList
          title="Factions"
          hidden={true}
          options={getOptions(factions)}
          clearAll={clearFilters(factions, setFactions)}
          onChange={filterHandler(factions, setFactions)}
        />
        <FilterList
          title="Types"
          hidden={true}
          options={getOptions(types)}
          clearAll={clearFilters(types, setTypes)}
          onChange={filterHandler(types, setTypes)}
        />
        <FilterList
          title="Subtypes"
          hidden={true}
          options={getOptions(subtypes)}
          clearAll={clearFilters(subtypes, setSubtypes)}
          onChange={filterHandler(subtypes, setSubtypes)}
        />
        <NestedFilterList
          title="Packs"
          hidden={true}
          options={getOptions(packs)}
          clearAll={clearGroupFilters(packs, setPacks)}
          onGroupChange={filterGroupHandler(packs, setPacks)}
          onSubitemChange={filterSubitemHandler(packs, setPacks)}
        />

        <Reset onClick={reset} />
        <SmallPrint />
      </ControlPanel>
      <CardList
        side={side}
        sort={sort}
        titleSearch={title}
        textSearch={text}
        factions={getFilter(factions)}
        types={getFilter(types)}
        subtypes={getFilter(subtypes)}
        packs={getNestedFilter(packs)}
      />
    </div>
  );
};

export default App;
