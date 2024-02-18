import React, { useState, useEffect } from 'react';
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

const App = ({ storage: storageProp, side }) => {

  const savedSettings = storage.init({ side });
  const [settings, setSettings] = useState(savedSettings);

  useEffect(() => {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(([factions, types, packs, subtypes]) =>
        setSettings(storage.integrate(storageProp, { factions, types, subtypes, packs })))
      .catch(err => console.log(err));
  }, [storageProp]);

  useEffect(() => {
    storage.save(settings)
  }, [settings]);

  const reset = () => setSettings(storage.init());

  const get = (prop) => settings[prop];

  const set = (prop) => (value) => setSettings({ ...settings, [prop]: value })

  const getOptions = (type) => filters.options(settings[type], get('side'));

  const getFilter = (type) => filters.get(settings[type], get('side'));

  const getNestedFilter = (type) => nestedFilters.get(settings[type], get('side'));

  const clearFilters = (type) => () =>
    setSettings({ ...settings, [type]: filters.clear(settings[type]) });

  const clearGroupFilters = (type) => () =>
    setSettings({ ...settings, [type]: nestedFilters.clear(settings[type]) });

  const filterHandler = (type) => (item, checked) =>
    setSettings({ ...settings, [type] : filters.set(settings[type], item, checked) });

  const filterGroupHandler = (type) => (item, checked) =>
    setSettings({ ...settings, [type] : nestedFilters.setGroup(settings[type], item, checked) });

  const filterSubitemHandler = (type) => (item, checked) =>
    setSettings({ ...settings, [type] : nestedFilters.setItem(settings[type], item, checked) });

  return (
    <div className="App">
      <ControlPanel>
        <div id="sides" data-testid="sides">
          <SideButton title='Runner' side="runner" selected={get('side') === 'runner'} onSelect={set('side')} />
          <SideButton title='Corp' side="corp" selected={get('side') === 'corp'} onSelect={set('side')} />
        </div>
        <TextSearch placeholder="search title" value={get('title')} onChange={set('title')} />
        <TextSearch placeholder="search text" value={get('text')} onChange={set('text')} />
        <SortSelect options={options} default={settings.sort} onChange={set('sort')} />

        <FilterList title="Factions" hidden={true} options={getOptions("factions")} clearAll={clearFilters("factions")} onChange={filterHandler("factions")} />
        <FilterList title="Types" hidden={true} options={getOptions("types")} clearAll={clearFilters("types")} onChange={filterHandler("types")} />
        <FilterList title="Subtypes" hidden={true} options={getOptions("subtypes")} clearAll={clearFilters("subtypes")} onChange={filterHandler("subtypes")} />
        <NestedFilterList title="Packs" hidden={true} options={getOptions("packs")} clearAll={clearGroupFilters("packs")} onGroupChange={filterGroupHandler("packs")} onSubitemChange={filterSubitemHandler("packs")} />

        <Reset onClick={reset}/>
        <SmallPrint/>
      </ControlPanel>
      <CardList side={get('side')} sort={get('sort')} titleSearch={get('title')} textSearch={get('text')} factions={getFilter('factions')} types={getFilter('types')} subtypes={getFilter('subtypes')} packs={getNestedFilter('packs')}/>
    </div>
  );
}

export default App;
