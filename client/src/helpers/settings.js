const init = ({ side } = {}) => ({
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

const load = () => {
  try {
    const initialSettings = init();
    const previousSession = JSON.parse(localStorage.getItem('settings'));
    return { ...initialSettings, ...previousSession };
  } catch (e) {
    return false;
  }
};

export default { init, save, load };
