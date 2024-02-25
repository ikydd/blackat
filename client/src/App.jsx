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

const setNormalSelection = (settings) => (option) => ({
  ...option,
  selected: settings.includes(option.code)
});

const setNestedSelection = (settings) => (group) => {
  const items = group.items ? group.items.map(setNormalSelection(settings)) : [];
  const allItemsSelected =
    items.length && items.filter(({ selected }) => selected).length === items.length;
  return {
    ...group,
    selected: allItemsSelected,
    items
  };
};

const App = ({ storage: storageProp = false, side: sideProp = 'runner' }) => {
  const initialSettings = storage.init({ side: sideProp });
  const [settings, setSettings] = useState(initialSettings);
  const [factions, setFactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [packs, setPacks] = useState([]);

  const getSetting = (setting) => {
    return settings[setting];
  };

  useEffect(() => {
    const previousSession = storageProp && storage.get();
    if (previousSession) {
      setSettings(previousSession);
    }
  }, [storageProp]);

  const updateSettings = (updates) => {
    const updatedSettings = { ...settings, ...updates };
    if (storageProp) {
      storage.save(updatedSettings);
    }
    setSettings(updatedSettings);
  };

  useEffect(() => {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(([loadedfactions, loadedTypes, loadedPacks, loadedSubtypes]) => {
        setFactions(loadedfactions);
        setTypes(loadedTypes);
        setSubtypes(loadedSubtypes);
        setPacks(loadedPacks);
      })
      .catch((err) => console.log(err));
  }, []);

  const reset = () => {
    updateSettings(storage.init());
  };

  const getOptions = (type, selected) =>
    filters.options(type, getSetting('side')).map(setNormalSelection(selected));

  const getSelections = (type, selected) =>
    selected.reduce((acc, code) => {
      const sideOptions = filters.options(type, getSetting('side'));
      if (sideOptions.find((choice) => choice.code === code)) {
        acc.push(code);
      }
      return acc;
    }, []);

  const getNestedOptions = (type, selected) =>
    filters.options(type, getSetting('side')).map(setNestedSelection(selected));

  const clearFilters = (type) => () => {
    updateSettings({ [type]: [] });
  };

  const simpleHandler = (type) => (value) => {
    updateSettings({ [type]: value });
  };

  const filterHandler = (type) => (item, checked) => {
    const filterSettings = new Set(getSetting(type));
    if (checked) {
      filterSettings.add(item.code);
    } else {
      filterSettings.delete(item.code);
    }
    updateSettings({ [type]: [...filterSettings] });
  };

  const filterGroupHandler = (type) => (group, checked) => {
    const itemCodes = group.items.map(({ code }) => code);
    const filterSettings = new Set(getSetting(type));
    itemCodes.forEach((code) => {
      if (checked) {
        filterSettings.add(code);
      } else {
        filterSettings.delete(code);
      }
    });
    updateSettings({ [type]: [...filterSettings] });
  };

  return (
    <div className="App">
      <ControlPanel>
        <div id="sides" data-testid="sides">
          <SideButton
            title="Runner"
            side="runner"
            selected={getSetting('side') === 'runner'}
            onSelect={simpleHandler('side')}
          />
          <SideButton
            title="Corp"
            side="corp"
            selected={getSetting('side') === 'corp'}
            onSelect={simpleHandler('side')}
          />
        </div>
        <TextSearch
          placeholder="search title"
          value={getSetting('title')}
          onChange={simpleHandler('title')}
        />
        <TextSearch
          placeholder="search text"
          value={getSetting('text')}
          onChange={simpleHandler('text')}
        />
        <SortSelect
          options={options}
          default={getSetting('sort')}
          onChange={simpleHandler('sort')}
        />

        <FilterList
          title="Factions"
          hidden={true}
          options={getOptions(factions, getSetting('factions'))}
          clearAll={clearFilters('factions')}
          onChange={filterHandler('factions')}
        />
        <FilterList
          title="Types"
          hidden={true}
          options={getOptions(types, getSetting('types'))}
          clearAll={clearFilters('types')}
          onChange={filterHandler('types')}
        />
        <FilterList
          title="Subtypes"
          hidden={true}
          options={getOptions(subtypes, getSetting('subtypes'))}
          clearAll={clearFilters('subtypes')}
          onChange={filterHandler('subtypes')}
        />
        <NestedFilterList
          title="Packs"
          hidden={true}
          options={getNestedOptions(packs, getSetting('packs'))}
          clearAll={clearFilters('packs')}
          onGroupChange={filterGroupHandler('packs')}
          onSubitemChange={filterHandler('packs')}
        />

        <Reset onClick={reset} />
        <SmallPrint />
      </ControlPanel>
      <CardList
        side={getSetting('side')}
        sort={getSetting('sort')}
        titleSearch={getSetting('title')}
        textSearch={getSetting('text')}
        factions={getSelections(factions, getSetting('factions'))}
        types={getSelections(types, getSetting('types'))}
        subtypes={getSelections(subtypes, getSetting('subtypes'))}
        packs={getSetting('packs')}
      />
    </div>
  );
};

export default App;
