var AbstractResource = require("../abstract_resourse"),
  Reports = AbstractResource("songs_reports");
db = require("../../db/postgresql");



Songs.getreport = function (report_type) {
  return db.query(`select * from songs where title = '${title}'`);
};


