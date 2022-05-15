/*
 * created by aditya on 14/09/18
 */

"use strict";

const PG = require("pg");
const Q = require("q");
const url = require("url");

//const config = global.Config.db.postgresql;
const config = require("./../../../../config").db.postgresql;
console.log(config);
const connectionParams = url.parse(config.appConnection);
const auth = connectionParams.auth.split(":");

let defaultPgConfig = {
  user: auth[0],
  password: auth[1],
  host: connectionParams.hostname,
  port: connectionParams.port,
  database: connectionParams.pathname.split("/")[1],
  ssl: connectionParams.hostname.indexOf("localhost") === -1,
  max: config.maxPoolSize, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

function PoolQuery(pgConfig = defaultPgConfig) {
  this.pool = new PG.Pool(pgConfig);

  this.pool.on("error", function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    try {
      console.error("idle client error", err.message, err.stack);
    } catch (e) {}
  });
}

PoolQuery.prototype.query = function query(sql, values) {
  let deferred = Q.defer();

  this.pool.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      error.sql = sql;
      if (Array.isArray(values)) {
        error.values = JSON.stringify(values);
      } else {
        error.values = "Invalid values";
      }
      deferred.reject(error);
    } else {
      deferred.resolve(result.rows);
    }
  });

  return deferred.promise;
};

PoolQuery.prototype.close = function close() {
  let deferred = Q.defer();

  this.pool.end(function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

module.exports = PoolQuery;
