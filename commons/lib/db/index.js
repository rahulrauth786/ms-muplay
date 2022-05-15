const Q = require("q");

const postgresql = require("./postgresql");

module.exports = {
  postgresql,
  configure: function configure(sqlScriptsFolderPath) {
    // To configure other connections add corresponding configure method in array.
    return Q.all([postgresql.configure(sqlScriptsFolderPath)]);
  },
};
