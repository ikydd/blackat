const fs = require('fs');
const path = require('path');

class Importer {
    constructor(api, importDir) {
        if (!api) {
            throw new Error('An API is required in the Importer');
        }
        if (!importDir) {
            throw new Error('An import directory is required in the Importer');
        }

        this.api = api;
        this.importDirectory = importDir;
    }

    async import(endpoint) {
        const data = await this.api.call(endpoint);
        const importPath = path.join(this.importDirectory, 'cards.json');
        return new Promise((resolve) => fs.writeFile(importPath, JSON.stringify(data), resolve));
    }
}

module.exports = Importer;
