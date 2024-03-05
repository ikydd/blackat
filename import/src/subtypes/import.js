const processSubtypes = require('./process');
const getLocalSavePath = require('../helpers/get-local-path');
const saveData = require('../helpers/save-file');

const importSubtypes = async (cards) => {
  const processedSubtypeData = processSubtypes(cards);
  await saveData(processedSubtypeData, getLocalSavePath('subtypes.json'));
};

module.exports = importSubtypes;
