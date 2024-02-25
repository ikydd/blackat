export const initSettings = ({ side } = {}) => ({
  side: side || 'runner',
  sort: 'faction',
  title: '',
  text: '',
  factions: [],
  types: [],
  subtypes: [],
  packs: []
});

export const saveSettings = (data) => {
  localStorage.setItem('settings', JSON.stringify(data));
};

export const loadSettings = () => {
  try {
    const initialSettings = initSettings();
    const previousSession = JSON.parse(localStorage.getItem('settings'));
    return { ...initialSettings, ...previousSession };
  } catch (e) {
    return false;
  }
};
