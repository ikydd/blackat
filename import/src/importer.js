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

    import(endpoint) {
        return this.api.call(endpoint)
            .then((data) => {
                const importPath = path.join(this.importDirectory, 'cards.json');
                return fs.writeFile(importPath, JSON.stringify(data));
            })
    }
}

module.exports = Importer;
