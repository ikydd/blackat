class Importer {
    constructor(api) {
        this.api = api;
    }

    cards() {
        return this.api.call('/cards');
    }
}

module.exports = Importer;
