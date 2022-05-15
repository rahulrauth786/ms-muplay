"use strict";

const ClientQuery = require("./ClientQuery");
const fs = require("fs");
const Q = require("q");

function dbConfigure(sqlScriptsFolderPath, pgConfig) {
  let deferred = Q.defer();

  console.log("dbConfigure");

  let client = new ClientQuery();

  function queryInSync(items, index) {
    if (index < items.length) {
      let deferred = Q.defer();

      client
        .query(items[index], [])
        .then(function () {
          deferred.resolve(queryInSync(items, index + 1));
        })
        .fail(function (error) {
          console.log("error at: ===", items[index]);
          deferred.reject(error);
        });
      return deferred.promise;
    }
  }

  function queryDDL() {
    const ddl = fs.readFileSync(
      sqlScriptsFolderPath + "indifi-ddl.sql",
      "utf8"
    );
    return client.query(ddl);
  }

  function queryIndexes() {
    if (fs.existsSync(sqlScriptsFolderPath + "indifi-indexes.sql")) {
      const indexes = fs.readFileSync(
        sqlScriptsFolderPath + "indifi-indexes.sql",
        "utf8"
      );
      return client.query(indexes, []);
    }
  }

  function queryFunctions() {
    let deferred = Q.defer();

    if (fs.existsSync(sqlScriptsFolderPath + "functions")) {
      let files = fs.readdirSync(sqlScriptsFolderPath + "functions");
      let functions = files.map(function (file) {
        return fs.readFileSync(
          sqlScriptsFolderPath + "functions/" + file,
          "utf8"
        );
      });
      queryInSync(functions, 0).then(deferred.resolve).fail(deferred.reject);
    } else {
      process.nextTick(function () {
        deferred.resolve();
      });
    }

    return deferred.promise;
  }

  function queryTriggers() {
    if (fs.existsSync(sqlScriptsFolderPath + "indifi-triggers.sql")) {
      console.log("starting triggers query");

      const triggers = fs.readFileSync(
        sqlScriptsFolderPath + "indifi-triggers.sql",
        "utf8"
      );
      return client.query(triggers, []);
    }
  }

  function queryGrants() {
    if (fs.existsSync(sqlScriptsFolderPath + "indifi-grants.sql")) {
      console.log("starting grants query");

      const grants = fs.readFileSync(
        sqlScriptsFolderPath + "indifi-grants.sql",
        "utf-8"
      );
      return client.query(grants, []);
    }
  }

  function runMigrations() {
    let queryFiles = [];
    return client
      .query("select * from indifi_query_files order by serial_no desc limit 1")
      .then((result) => {
        if (fs.existsSync(sqlScriptsFolderPath + "indifi-queries")) {
          let start_number = 1;

          if (result.length > 0) {
            start_number =
              Number(
                result[0].file_name.substring(
                  1,
                  result[0].file_name.indexOf("_")
                )
              ) + 1;
          }

          let local_files = fs.readdirSync(
            sqlScriptsFolderPath + "indifi-queries"
          );

          local_files.forEach(function (file) {
            let current_file_number = Number(
              file.substring(1, file.indexOf("_"))
            );
            if (current_file_number >= start_number) {
              let queryFile = {
                executed: false,
                name: "v" + current_file_number + "_indifi-queries.sql",
              };
              queryFiles.push(queryFile);
            }
          });

          let queries = [];
          queryFiles.forEach((queryFile) => {
            let filePath =
              sqlScriptsFolderPath + "indifi-queries/" + queryFile.name;
            queryFile.contents = fs.readFileSync(filePath, "utf8");
            queryFile.executed = true;
            queries.push(queryFile.contents);
          });

          return queryInSync(queries, 0);
        }
      })
      .then(() => {
        return queryFiles.reduce(function (promise, queryFile) {
          return promise.then(function () {
            let query =
              "insert into indifi_query_files (file_name, file_contents) values ($1, $2)";
            return (
              queryFile.executed &&
              client.query(query, [queryFile.name, queryFile.contents])
            );
          });
        }, Q());
      });
  }

  client
    .connect(pgConfig)
    .then(function () {
      return queryDDL();
    })
    .then(function () {
      console.log("ddl query complete");
      return queryIndexes();
    })
    .then(function () {
      console.log("indexes query complete");
      return queryFunctions();
    })
    .then(function () {
      console.log("functions query complete");
      return queryTriggers();
    })
    .then(function () {
      console.log("triggers query complete");
      return queryGrants();
    })
    .then(function () {
      console.log("grants query complete");
      return runMigrations();
    })
    .then(function () {
      console.log("query(migration) file query complete");
      console.log("migration complete");
      deferred.resolve("migration complete");
    })
    .fail(function (error) {
      console.log(error);
      deferred.reject(error);
    })
    .finally(function () {
      client.close();
    });

  return deferred.promise;
}

module.exports = dbConfigure;
