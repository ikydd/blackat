const fs = require("fs");
const path = require("path");

class Importer {
  constructor(api, importDir) {
    if (!api) {
      throw new Error("An API is required in the Importer");
    }
    if (!importDir) {
      throw new Error("An import directory is required in the Importer");
    }

    this.api = api;
    this.importDirectory = importDir;
  }

  async import(endpoint, handler = (data) => data) {
    const data = await this.api.call(endpoint);
    const transformedData = handler(data);
    const importPath = path.join(this.importDirectory, "cards.json");
    return new Promise((resolve) =>
      fs.writeFile(importPath, JSON.stringify(transformedData), resolve)
    );
  }
}

module.exports = Importer;
