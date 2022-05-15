var AbstractResource = require("./abstract_resourse"),
  Most = AbstractResource("most_search_songs");
db = require("../db/postgresql");

Songs.checkSongExist = function (title) {
  return db.query(`select * from songs where title = '${title}'`);
};

Songs.totalSongs = function () {
  return db.query(`select * from songs`);
};

Songs.getSongsByLimit = function (limit) {
  return db.query(`select * from songs order by created DESC limit ${limit}`);
};
module.exports = Songs;
