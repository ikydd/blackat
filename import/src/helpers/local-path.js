const path = require("path");

const dataPath = (file) =>
  path.join(__dirname, "..", "..", "..", "server", "data", file);

module.exports = dataPath;
