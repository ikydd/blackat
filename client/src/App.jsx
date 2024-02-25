import React, { useState, useEffect } from 'react';
import { getData } from './helpers/api';
import settingsHelper from './helpers/settings';
import filterHelper from './helpers/controls';
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

const filterBySide =
  (desiredSide) =>
  ({ side }) =>
    !side || side === desiredSide;

const selectFilterFromSettings = (settings) => (option) => ({
  ...option,
  selected: settings.includes(option.code)
});

const selectNestedFiltersFromSettings = (settings) => (group) => {
  const items = group.items ? group.items.map(selectFilterFromSettings(settings)) : [];
  const allItemsSelected =
    items.length && items.filter(({ selected }) => selected).length === items.length;
  return {
    ...group,
    selected: allItemsSelected,
    items
  };
};

const App = ({ saveState = false, side: sideProp = 'runner' }) => {
  const initialSettings = settingsHelper.init({ side: sideProp });
  const [settings, setSettings] = useState(initialSettings);
  const [factions, setFactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [packs, setPacks] = useState([]);

  const loadSettings = () => {
    const previousSession = saveState && settingsHelper.load();
    if (previousSession) {
      setSettings(previousSession);
    }
  };

  const updateSettings = (updates) => {
    const updatedSettings = { ...settings, ...updates };
    if (saveState) {
      settingsHelper.save(updatedSettings);
    }
    setSettings(updatedSettings);
  };

  useEffect(() => {
    loadSettings();
  }, [saveState]);

  useEffect(() => {
    Promise.all([getData('factions'), getData('types'), getData('packs'), getData('subtypes')])
      .then(([loadedfactions, loadedTypes, loadedPacks, loadedSubtypes]) => {
        setFactions(loadedfactions);
        setTypes(loadedTypes);
        setSubtypes(loadedSubtypes);
        setPacks(loadedPacks);
      })
      /* eslint-disable-next-line no-console */
      .catch((err) => console.log(err));
  }, []);

  const currentFactions = factions
    .filter(filterBySide(settings.side))
    .map(selectFilterFromSettings(settings.factions));
  const currentTypes = types
    .filter(filterBySide(settings.side))
    .map(selectFilterFromSettings(settings.types));
  const currentSubtypes = subtypes
    .filter(filterBySide(settings.side))
    .map(selectFilterFromSettings(settings.subtypes));
  const currentPacks = packs.map(selectNestedFiltersFromSettings(settings.packs));

  const getSelections = (type, selected) =>
    selected.reduce((acc, code) => {
      const sideOptions = filterHelper.options(type, settings.side);
      if (sideOptions.find((choice) => choice.code === code)) {
        acc.push(code);
      }
      return acc;
    }, []);

  const updateSimpleFilter = (type) => (value) => {
    updateSettings({ [type]: value });
  };

  const filterHandler = (type) => (item, checked) => {
    const filterSettings = new Set(settings[type]);
    if (checked) {
      filterSettings.add(item.code);
    } else {
      filterSettings.delete(item.code);
    }
    updateSettings({ [type]: [...filterSettings] });
  };

  const filterGroupHandler = (type) => (group, checked) => {
    const itemCodes = group.items.map(({ code }) => code);
    const filterSettings = new Set(settings[type]);
    itemCodes.forEach((code) => {
      if (checked) {
        filterSettings.add(code);
      } else {
        filterSettings.delete(code);
      }
    });
    updateSettings({ [type]: [...filterSettings] });
  };

  const clearListFilter = (type) => () => {
    updateSettings({ [type]: [] });
  };

  const resetAllFilters = () => {
    updateSettings(settingsHelper.init());
  };

  return (
    <div className="App">
      <ControlPanel>
        <div id="sides" data-testid="sides">
          <SideButton
            title="Runner"
            side="runner"
            selected={settings.side === 'runner'}
            onSelect={updateSimpleFilter('side')}
          />
          <SideButton
            title="Corp"
            side="corp"
            selected={settings.side === 'corp'}
            onSelect={updateSimpleFilter('side')}
          />
        </div>
        <TextSearch
          placeholder="search title"
          value={settings.title}
          onChange={updateSimpleFilter('title')}
        />
        <TextSearch
          placeholder="search text"
          value={settings.text}
          onChange={updateSimpleFilter('text')}
        />
        <SortSelect
          options={options}
          default={settings.sort}
          onChange={updateSimpleFilter('sort')}
        />

        <FilterList
          title="Factions"
          hidden={true}
          options={currentFactions}
          clearAll={clearListFilter('factions')}
          onChange={filterHandler('factions')}
        />
        <FilterList
          title="Types"
          hidden={true}
          options={currentTypes}
          clearAll={clearListFilter('types')}
          onChange={filterHandler('types')}
        />
        <FilterList
          title="Subtypes"
          hidden={true}
          options={currentSubtypes}
          clearAll={clearListFilter('subtypes')}
          onChange={filterHandler('subtypes')}
        />
        <NestedFilterList
          title="Packs"
          hidden={true}
          options={currentPacks}
          clearAll={clearListFilter('packs')}
          onGroupChange={filterGroupHandler('packs')}
          onSubitemChange={filterHandler('packs')}
        />

        <Reset onClick={resetAllFilters} />
        <SmallPrint />
      </ControlPanel>
      <CardList
        side={settings.side}
        sort={settings.sort}
        titleSearch={settings.title}
        textSearch={settings.text}
        factions={getSelections(factions, settings.factions)}
        types={getSelections(types, settings.types)}
        subtypes={getSelections(subtypes, settings.subtypes)}
        packs={settings.packs}
      />
    </div>
  );
};

export default App;
