import React, { useState, useEffect } from 'react';
import { getData } from './helpers/api';
import { initSettings, loadSettings, saveSettings } from './helpers/settings';
import sortOptions from './helpers/options';
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

const setOptionToMatchSettings = (option, settings) => ({
  ...option,
  selected: settings.includes(option.code)
});

const setGroupOfFiltersToMatchSettings = (group, settings) => {
  const items = group.items.map((option) => setOptionToMatchSettings(option, settings));
  const allItemsInGroupSelected = items.filter(({ selected }) => selected).length === items.length;
  return {
    ...group,
    selected: allItemsInGroupSelected,
    items
  };
};

const App = ({ saveState = false, side: sideProp = 'runner' }) => {
  const initialSettings = initSettings({ side: sideProp });
  const [settings, setSettings] = useState(initialSettings);
  const [factions, setFactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [packs, setPacks] = useState([]);

  const loadPreviousSession = () => {
    const previousSession = saveState && loadSettings();
    if (previousSession) {
      setSettings(previousSession);
    }
  };

  const updateSettings = (updates) => {
    const updatedSettings = { ...settings, ...updates };
    if (saveState) {
      saveSettings(updatedSettings);
    }
    setSettings(updatedSettings);
  };

  useEffect(() => {
    loadPreviousSession();
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

  const setupFilterForCurrentSide = (options, filterSettings) =>
    options
      .filter(filterBySide(settings.side))
      .map((option) => setOptionToMatchSettings(option, filterSettings));

  const currentFactions = setupFilterForCurrentSide(factions, settings.factions);
  const currentTypes = setupFilterForCurrentSide(types, settings.types);
  const currentSubtypes = setupFilterForCurrentSide(subtypes, settings.subtypes);
  const currentPacks = packs.map((group) =>
    setGroupOfFiltersToMatchSettings(group, settings.packs)
  );

  const filterSettingsToMatchCurrentOptions = (selected, filterOptions) => {
    const appearsInCurrentOptions = (selection) =>
      filterOptions.some(({ code }) => code === selection);
    return selected.filter((selection) => appearsInCurrentOptions(selection));
  };

  const updateSimpleFilter = (type) => (value) => {
    updateSettings({ [type]: value });
  };

  const addOrRemoveSelections = (currentSettings, codes, selected) => {
    const listOfCodes = Array.isArray(codes) ? codes : [codes];
    const dedupedSettings = new Set(currentSettings);
    listOfCodes.forEach((code) => {
      if (selected) {
        dedupedSettings.add(code);
      } else {
        dedupedSettings.delete(code);
      }
    });
    return [...dedupedSettings];
  };

  const onSelectionHandler = (type) => (code, checked) => {
    const updatedSettings = addOrRemoveSelections(settings[type], code, checked);
    updateSettings({ [type]: updatedSettings });
  };

  const clearListFilter = (type) => () => {
    updateSettings({ [type]: [] });
  };

  const resetAllFilters = () => {
    updateSettings(initSettings());
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
          options={sortOptions}
          default={settings.sort}
          onChange={updateSimpleFilter('sort')}
        />

        <FilterList
          title="Factions"
          hidden={true}
          options={currentFactions}
          clearAll={clearListFilter('factions')}
          onChange={onSelectionHandler('factions')}
        />
        <FilterList
          title="Types"
          hidden={true}
          options={currentTypes}
          clearAll={clearListFilter('types')}
          onChange={onSelectionHandler('types')}
        />
        <FilterList
          title="Subtypes"
          hidden={true}
          options={currentSubtypes}
          clearAll={clearListFilter('subtypes')}
          onChange={onSelectionHandler('subtypes')}
        />
        <NestedFilterList
          title="Packs"
          hidden={true}
          options={currentPacks}
          clearAll={clearListFilter('packs')}
          onChange={onSelectionHandler('packs')}
        />

        <Reset onClick={resetAllFilters} />
        <SmallPrint />
      </ControlPanel>
      <CardList
        side={settings.side}
        sort={settings.sort}
        titleSearch={settings.title}
        textSearch={settings.text}
        factions={filterSettingsToMatchCurrentOptions(settings.factions, currentFactions)}
        types={filterSettingsToMatchCurrentOptions(settings.types, currentTypes)}
        subtypes={filterSettingsToMatchCurrentOptions(settings.subtypes, currentSubtypes)}
        packs={settings.packs}
      />
    </div>
  );
};

export default App;
