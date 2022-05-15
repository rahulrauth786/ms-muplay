var AbstractResource = require("./abstract_resourse"),
  User = AbstractResource("users");
db = require("../db/postgresql");
// User = require(".").Resources;
var Q = require("q");
//const { db } = require("../../../config");

module.exports = User;

User.getuser = function (req) {
  return db.query(`select * from users where email = 'rahul@gmail.com'`);
};

User.findAllUser = function () {
  return db.query(`select * from users`);
};

User.findByEmailId = function (email) {
  return db.query(`select * from users where email = '${email}'`);
};

User.findByPhone = function (phone) {
  return db.query(`select * from users where phone1 = '${phone}'`);
};

User.findById = function (id) {
  return db.query(`select * from users where id = '${id}'`);
};

User.findByUserId = function (email, password) {
  return db.query(
    `select * from users where email = '${email}' and password = '${password}'`
  );
};
