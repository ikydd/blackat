import React, { useState, useEffect } from 'react';
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
import { prepareGroupingData, groupCards } from './helpers/group-cards';
import { prepareSortingData, sortCards } from './helpers/sort-cards';
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

  const originalArt = settings.preferences.find((pref) => pref === 'original');
  const rotation = settings.preferences.includes('rotation');
  const legal = settings.preferences.includes('legal');
  const official = settings.preferences.includes('official');

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

  const filteredCards = filterCards(cards, {
    ...settings,
    legal,
    rotation,
    official,
    textSearch: settings.text,
    titleSearch: settings.title,
    factions: adjustSettingsToMatchCurrentOptions(settings.factions, currentFactions),
    types: adjustSettingsToMatchCurrentOptions(settings.types, currentTypes),
    subtypes: adjustSettingsToMatchCurrentOptions(settings.subtypes, currentSubtypes)
  });
  const sortedCards = sortCards(filteredCards, sortingData, settings.sort);
  const sections = groupCards(sortedCards, groupingData, settings.sort);

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
              <ThemeSelector />
            </ControlPanel>
            <CardGallery sections={sections} art={originalArt} />
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
