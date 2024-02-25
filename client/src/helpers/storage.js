const unselected = (option) => ({ ...option, selected: false });
const nestedUnselected = (option) => ({
  ...option,
  selected: false,
  items: option.items.map(unselected)
});
const setNormalSelection = (storage) => (option) => ({
  ...option,
  selected: storage.includes(option.code)
});
const setNestedSelection = (storage) => (group) => ({
  ...group,
  selected: storage.includes(group.code),
  items: group.items.map(setNormalSelection(storage))
});

const init = ({ side } = {}) =>
  ({
    side: side || 'runner',
    sort: 'faction',
    title: '',
    text: '',
    factions: [],
    types: [],
    subtypes: [],
    packs: []
  });

const save = (data) => {
  localStorage.setItem('settings', JSON.stringify(data));
};

const get = () => {
  try {
    const initialSettings = init();
    const previousSession = JSON.parse(localStorage.getItem('settings'));
    return { ...initialSettings, ...previousSession };
  } catch (e) {
    return false
  }
}

const integrate = (previousSession, { factions, types, packs, subtypes }) => {
  if (previousSession) {
    try {
      const storage = JSON.parse(previousSession);
      const { side, sort, title, text } = storage;
      const settings = {};
      settings.side = side || 'runner';
      settings.sort = sort || 'faction';
      settings.title = title || '';
      settings.text = text || '';
      settings.factions = Array.isArray(storage.factions)
        ? factions.map(setNormalSelection(storage.factions))
        : factions;
      settings.types = Array.isArray(storage.types)
        ? types.map(setNormalSelection(storage.types))
        : types;
      settings.subtypes = Array.isArray(storage.subtypes)
        ? subtypes.map(setNormalSelection(storage.subtypes))
        : subtypes;
      settings.packs = Array.isArray(storage.packs)
        ? packs.map(setNestedSelection(storage.packs))
        : packs;

      return settings;
    } catch (e) {
      // fail silently
    }
  }
  return {
    factions: factions.map(unselected),
    types: types.map(unselected),
    subtypes: subtypes.map(unselected),
    packs: packs.map(nestedUnselected)
  };
};

export { init, save, get, integrate };
