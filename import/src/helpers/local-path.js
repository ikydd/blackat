const path = require("path");

const dataPath = (file) =>
  path.join(__dirname, "..", "..", "..", "client", "public", "data", file);

module.exports = dataPath;
