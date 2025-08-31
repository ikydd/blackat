import React, { useState, useEffect, useMemo } from 'react';
import getData from './helpers/api';
import { initSettings, loadSettings, saveSettings } from './helpers/settings-manager';
import sortOptions from './helpers/sort-options';
import preferencesOptions from './helpers/preferences-options';
import CardGallery from './components/CardGallery';
import ControlPanel from './components/ControlPanel';
import ThemeSelector from './components/ThemeSelector';
import SideButton from './components/SideButton';
import FilterList from './components/FilterList';
import NestedFilterList from './components/NestedFilterList';
import TextSearch from './components/TextSearch';
import SortSelect from './components/SortSelect';
import Reset from './components/Reset';
import SmallPrint from './components/SmallPrint';
import Loader from './components/Loader';
import Header from './components/Header';
import Icon from './components/Icon';
import filterCards from './helpers/filter-cards';
import filterPacks from './helpers/filter-packs';
import { prepareGroupingData, groupCards } from './helpers/group-cards';
import { prepareSortingData, sortCards } from './helpers/sort-cards';
import './App.css';

const filterOptionsBySide = (options, currentSide) =>
  options.filter(({ side }) => !side || side === currentSide);

const filterAllOptionsBySide = ({ factions, types, subtypes }, side) => {
  return {
    factions: filterOptionsBySide(factions, side),
    types: filterOptionsBySide(types, side),
    subtypes: filterOptionsBySide(subtypes, side)
  };
};

const filterSettingsToMatchCurrentOptions = (selected, filterOptions) => {
  const appearsInCurrentOptions = (selection) =>
    filterOptions.some(({ code }) => code === selection);
  return selected.filter((selection) => appearsInCurrentOptions(selection));
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

const App = ({ saveState = false, side: sideProp = 'runner' }) => {
  const initialSettings = initSettings({ side: sideProp });
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [factions, setFactions] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [packs, setPacks] = useState([]);
  const [cards, setCards] = useState([]);
  const [sortingData, setSortingData] = useState();
  const [groupingData, setGroupingData] = useState();

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
    Promise.all([
      getData('cards'),
      getData('factions'),
      getData('types'),
      getData('packs'),
      getData('subtypes')
    ])
      .then(([loadedCards, loadedfactions, loadedTypes, loadedPacks, loadedSubtypes]) => {
        setFactions(loadedfactions);
        setTypes(loadedTypes);
        setSubtypes(loadedSubtypes);
        setPacks(loadedPacks);
        setSortingData(
          prepareSortingData({ factions: loadedfactions, types: loadedTypes, packs: loadedPacks })
        );
        setGroupingData(
          prepareGroupingData({ factions: loadedfactions, types: loadedTypes, packs: loadedPacks })
        );
        setCards(loadedCards);
        setLoaded(true);
      })
      /* eslint-disable-next-line no-console */
      .catch((err) => console.log(err));
  }, []);

  const originalArt = settings.preferences.includes('original');
  const rotation = settings.preferences.includes('rotation');
  const legal = settings.preferences.includes('legal');
  const official = settings.preferences.includes('official');

  const filters = useMemo(
    () => ({
      runner: filterAllOptionsBySide({ factions, types, subtypes }, 'runner'),
      corp: filterAllOptionsBySide({ factions, types, subtypes }, 'corp')
    }),
    [factions, types, subtypes]
  );

  const currentFactions = filters[settings.side].factions;
  const currentTypes = filters[settings.side].types;
  const currentSubtypes = filters[settings.side].subtypes;
  const currentPacks = useMemo(
    () =>
      filterPacks(packs, {
        official,
        rotation
      }),
    [packs, official, rotation]
  );

  const factionSettings = useMemo(
    () => filterSettingsToMatchCurrentOptions(settings.factions, currentFactions),
    [settings.factions, currentFactions]
  );

  const typeSettings = useMemo(
    () => filterSettingsToMatchCurrentOptions(settings.types, currentTypes),
    [settings.types, currentTypes]
  );

  const subtypeSettings = useMemo(
    () => filterSettingsToMatchCurrentOptions(settings.subtypes, currentSubtypes),
    [settings.subtypes, currentSubtypes]
  );

  const sortedCards = useMemo(
    () => sortCards(cards, sortingData, settings.sort),
    [cards, sortingData, settings.sort]
  );

  const filteredCards = filterCards(sortedCards, {
    ...settings,
    legal,
    rotation,
    official,
    originalArt,
    textSearch: settings.text,
    titleSearch: settings.title,
    factions: factionSettings,
    types: typeSettings,
    subtypes: subtypeSettings
  });

  const sections = groupCards(filteredCards, groupingData, settings.sort);

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
      <main className={loaded ? '' : 'loading'}>
        {loaded ? (
          <>
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
                settings={settings.factions}
                clearAll={clearListFilter('factions')}
                onChange={onSelectionHandler('factions')}
              />
              <FilterList
                title="Types"
                closed={true}
                options={currentTypes}
                settings={settings.types}
                clearAll={clearListFilter('types')}
                onChange={onSelectionHandler('types')}
              />
              <FilterList
                title="Subtypes"
                closed={true}
                options={currentSubtypes}
                settings={settings.subtypes}
                clearAll={clearListFilter('subtypes')}
                onChange={onSelectionHandler('subtypes')}
              />
              <NestedFilterList
                title="Packs"
                closed={true}
                options={currentPacks}
                settings={settings.packs}
                clearAll={clearListFilter('packs')}
                onChange={onSelectionHandler('packs')}
              />
              <NestedFilterList
                title="Preferences"
                closed={true}
                options={preferencesOptions}
                settings={settings.preferences}
                clearAll={clearListFilter('preferences')}
                onChange={onSelectionHandler('preferences')}
              />

              <Reset onClick={resetAllFilters} />
              <ThemeSelector />
            </ControlPanel>
            <CardGallery sections={sections} />
          </>
        ) : (
          <Loader />
        )}
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
