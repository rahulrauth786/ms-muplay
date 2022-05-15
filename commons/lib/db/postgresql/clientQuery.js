"use strict";

const PG = require("pg");
const Q = require("q");
const url = require("url");
const copyTo = require("pg-copy-streams").to;
const copyFrom = require("pg-copy-streams").from;
const QueryStream = require("pg-query-stream");
const config = require("./../../../../config").db.postgresql;

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

function ClientQuery() {
  this.client = null;
}

ClientQuery.prototype.connect = function connect(pgConfig = defaultPgConfig) {
  let deferred = Q.defer();
  let _self = this;

  
  

  let connection = new PG.Client(pgConfig);

  connection.connect(function connectCallback(err) {
    if (err) {
      deferred.reject(err);
      console.log(err);
    } else {
      _self.client = connection;
      console.log("ClientQuery");
      deferred.resolve(connection);
    }
  });

  return deferred.promise;
};

ClientQuery.prototype.query = function query(sql, values) {
  let deferred = Q.defer();

  if (!this.client) {
    throw new Error("Client is not connected. Please call connect first");
  }

  this.client.query(sql, values, function queryCallback(err, result) {
    if (err) {
      err.sql = sql;
      err.values = JSON.stringify(values);

      deferred.reject(err);
    } else {
      deferred.resolve(result.rows);
    }
  });

  return deferred.promise;
};

ClientQuery.prototype.close = function close() {
  let deferred = Q.defer();

  if (!this.client) {
    throw new Error("Client is not connected. Please call connect first");
  }

  this.client.end(function endCallback(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
};

ClientQuery.prototype.getCopyStream = function (sql) {
  if (!this.client) {
    throw new Error("Client is not connected. Please call connect first");
  }
  return this.client.query(copyTo(sql));
};

ClientQuery.prototype.copyFromStream = function (sql) {
  if (!this.client) {
    throw new Error("Client is not connected. Please call connect first");
  }
  return this.client.query(copyFrom(sql));
};

/**
 *
 * @param sql (text)
 * @param values (array)
 * @param options (object)
 * @returns {*}
 */
ClientQuery.prototype.getQueryStream = function (sql, values, options) {
  if (!this.client) {
    throw new Error("Client is not connected. Please call connect first");
  }
  const query = new QueryStream(sql, values, options);
  return this.client.query(query);
};

module.exports = ClientQuery;
