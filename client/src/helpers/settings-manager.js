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

const validateSettings = (candidate) => {
  const init = initSettings();

  Object.keys(candidate).forEach((key) => {
    const initKey = typeof init[key];
    if (initKey === 'undefined') {
      throw new Error('Extra keys present in settings');
    }
    const candidateType = typeof candidate[key];
    if (candidateType !== initKey) {
      throw new Error(`Invalid key type in settings: ${key} was type ${candidateType}`)
    }
  });
};

export const loadSettings = () => {
  try {
    const initialSettings = initSettings();
    const previousSession = JSON.parse(localStorage.getItem('settings'));
    if (previousSession){
      validateSettings(previousSession);
    }
    return { ...initialSettings, ...previousSession };
  } catch (e) {
    return false;
  }
};
