const path = require("path");

const dataPath = (file) =>
  path.join(__dirname, "..", "..", "output", "data", file);

module.exports = dataPath;
