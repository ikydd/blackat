import React, { useState, useEffect } from 'react';
import getData from './helpers/api';
import { initSettings, loadSettings, saveSettings } from './helpers/settings-manager';
import sortOptions from './helpers/sort-options';
import preferencesOptions from './helpers/preferences-options';
import CardList from './components/CardList';
import ControlPanel from './components/ControlPanel';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import NestedFilterList from './components/NestedFilterList';
import TextSearch from './components/TextSearch';
import SortSelect from './components/SortSelect';
import Reset from './components/Reset';
import SmallPrint from './components/SmallPrint';
import Header from './components/Header';
import Icon from './components/Icon';
import './App.css';

const setOptionToMatchSettings = (option, settings) => {
  const isGroup = option.items;
  if (isGroup) {
    const items = option.items.map((subOption) => setOptionToMatchSettings(subOption, settings));
    const allItemsInGroupSelected =
      items.filter(({ selected }) => selected).length === items.length;
    return {
      ...option,
      selected: allItemsInGroupSelected,
      items
    };
  }
  return {
    ...option,
    selected: settings.includes(option.code)
  };
};

const setupFilter = (options, filterSettings) =>
  options.map((option) => setOptionToMatchSettings(option, filterSettings));

const setupFilterForCurrentSide = (options, filterSettings, currentSide) =>
  options
    .filter(({ side }) => !side || side === currentSide)
    .map((option) => setOptionToMatchSettings(option, filterSettings));

const isOfficial = (card, official) => !official || card.official;
const isNotRotated = (card, rotated) => !rotated || !card.rotated;

const setupFilterForOfficial = (options, filterSettings, { official = false, rotation = false }) =>
  options
    .filter((card) => isOfficial(card, official) && isNotRotated(card, rotation))
    .map((option) => setOptionToMatchSettings(option, filterSettings));

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

  const originalArt = settings.preferences.find((pref) => pref === 'original');
  const rotation = settings.preferences.some((pref) => pref === 'rotation');
  const legal = settings.preferences.some((pref) => pref === 'legal');
  const official = settings.preferences.some((pref) => pref === 'official');

  const currentFactions = setupFilterForCurrentSide(factions, settings.factions, settings.side);
  const currentTypes = setupFilterForCurrentSide(types, settings.types, settings.side);
  const currentSubtypes = setupFilterForCurrentSide(subtypes, settings.subtypes, settings.side);
  const currentPacks = setupFilterForOfficial(packs, settings.packs, {
    official,
    rotation
  });
  const currentPreferences = setupFilter(preferencesOptions, settings.preferences);

  const adjustSettingsToMatchCurrentOptions = (selected, filterOptions) => {
    const appearsInCurrentOptions = (selection) =>
      filterOptions.some(({ code }) => code === selection);
    return selected.filter((selection) => appearsInCurrentOptions(selection));
  };

  const updateSimpleFilter = (type) => (value) => {
    updateSettings({ [type]: value });
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
    <div id="blackat">
      <header>
        <Header />
      </header>
      <main>
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
            closed={true}
            options={currentFactions}
            clearAll={clearListFilter('factions')}
            onChange={onSelectionHandler('factions')}
          />
          <FilterList
            title="Types"
            closed={true}
            options={currentTypes}
            clearAll={clearListFilter('types')}
            onChange={onSelectionHandler('types')}
          />
          <FilterList
            title="Subtypes"
            closed={true}
            options={currentSubtypes}
            clearAll={clearListFilter('subtypes')}
            onChange={onSelectionHandler('subtypes')}
          />
          <NestedFilterList
            title="Packs"
            closed={true}
            options={currentPacks}
            clearAll={clearListFilter('packs')}
            onChange={onSelectionHandler('packs')}
          />
          <NestedFilterList
            title="Preferences"
            closed={true}
            options={currentPreferences}
            clearAll={clearListFilter('preferences')}
            onChange={onSelectionHandler('preferences')}
          />

          <Reset onClick={resetAllFilters} />
        </ControlPanel>
        <CardList
          side={settings.side}
          sort={settings.sort}
          titleSearch={settings.title}
          textSearch={settings.text}
          factions={adjustSettingsToMatchCurrentOptions(settings.factions, currentFactions)}
          types={adjustSettingsToMatchCurrentOptions(settings.types, currentTypes)}
          subtypes={adjustSettingsToMatchCurrentOptions(settings.subtypes, currentSubtypes)}
          packs={settings.packs}
          art={originalArt}
          official={official}
          rotation={rotation}
          legal={legal}
        />
      </main>
      <footer>
        <div>
          <SmallPrint />
          <div id="back-to-top">
            <Icon code="subroutine" />{' '}
            <a title="Back to top" href="#top">
              Reboot
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
