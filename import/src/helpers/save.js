const fs = require("fs");

const save = async (data, filepath) => {
  if (!data) {
    throw new Error("Some data is required to save");
  }
  if (!filepath) {
    throw new Error("A file path is required to save data");
  }
  return new Promise((resolve) =>
    fs.writeFile(filepath, JSON.stringify(data), resolve)
  );
};

module.exports = save;
