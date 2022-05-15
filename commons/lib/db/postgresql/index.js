"use strict";

//const config = global.Config.db.postgresql;
const config = require("./../../../../config").db.postgresql;

const url = require("url");
const PoolQuery = require("./PoolQuery");
const ClientQuery = require("./ClientQuery");

const DBConfigure = require("./DBConfigure");

const connectionParams = url.parse(config.appConnection);
const auth = connectionParams.auth.split(":");
console.log("index");
const pgConfig = {
  user: auth[0],
  password: auth[1],
  host: connectionParams.hostname,
  port: connectionParams.port,
  database: connectionParams.pathname.split("/")[1],
  ssl: false,
  max: config.maxPoolSize, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

let pool;
if (config.createPool === undefined || config.createPool) {
  pool = new PoolQuery(pgConfig);
}

function configure(sqlScriptsFolderPath) {
  const masterConnectionParams = url.parse(config.masterConnection);
  const masterAuth = masterConnectionParams.auth.split(":");
  const masterPGConfig = {
    user: masterAuth[0],
    password: masterAuth[1],
    host: masterConnectionParams.hostname,
    port: masterConnectionParams.port,
    database: masterConnectionParams.pathname.split("/")[1],
    ssl: true,
    max: 1,
    idleTimeoutMillis: 30000,
  };

  return DBConfigure(sqlScriptsFolderPath, masterPGConfig);
}

function query(sql, values) {
  if (!pool) {
    throw new Error("Pool is not defined");
  }
  return pool.query(sql, values);
}
// let sql = `insert into users (email,phone1,name,role,activate)values('pankaj@gmail.com','9163593592','Pankaj','admin','true')`;

// query(sql, []).then((result) => {
//   console.log(result);
// });

module.exports = {
  // query: pool.query,
  query,
  clientQuery: ClientQuery,
  configure,
};
