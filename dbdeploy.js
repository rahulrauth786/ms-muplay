"use strict";

global.Config = require("./config");

var db = require("./commons").db;
var Q = require("q");

Q.try(function () {
  var deferred = Q.defer();
  var configured = false;
  for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i] && process.argv[i] === "dbconfig") {
      if (process.argv[i + 1]) {
        if (process.argv[i + 1] === global.Config.env) {
          configured = true;
          db.configure(__dirname + "/sql-scripts/")
            .then(function () {
              deferred.resolve();
              process.exit(0);
            })
            .fail(function (error) {
              console.log(error);
              deferred.reject(error);
              process.exit(1);
            });
        } else {
          console.log("Environment Mismatch");
          process.exit(1);
        }
      } else {
        console.log("Pass environment type as argument");
        process.exit(1);
      }
      break;
    }
  }

  if (!configured) {
    deferred.resolve();
    process.exit(0);
  }
  return deferred.promise;
}).fail(function (error) {
  console.log("Failed in DB configuration and loading: " + error);
  console.log(error.stack);
  process.exit(1);
});
