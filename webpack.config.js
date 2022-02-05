const path = require("path");

module.exports = {
  entry: path.resolve("./codigo/ranas-db.js"),
  cache: false,
  output: {
    filename: "ranas-db.js",
    path: path.resolve("./distribucion"),
  },
};