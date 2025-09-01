const saveData = require('../helpers/save-file');
const getLocalSavePath = require('../helpers/get-local-path');

const saveDate = () => saveData({ timestamp: Date.now() }, getLocalSavePath('timestamp.json'));

module.exports = saveDate;
