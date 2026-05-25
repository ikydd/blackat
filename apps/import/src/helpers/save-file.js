const fs = require("fs-extra");
const path = require("path");

const save = async (data, filepath) => {
  if (!data) {
    throw new Error("Some data is required to save");
  }
  if (!filepath) {
    throw new Error("A file path is required to save data");
  }
  await fs.ensureDir(path.dirname(filepath));
  return fs.writeFile(filepath, JSON.stringify(data));
};

module.exports = save;
