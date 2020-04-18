const path = require('path');
const SourceApi = require('./src/source-api');
const Importer = require('./src/importer');

const nrdb = new SourceApi('https://netrunnerdb.com/api/2.0/public');
const importer = new Importer(nrdb, path.join(__dirname, 'data-tmp'));

importer.import('/cards');
