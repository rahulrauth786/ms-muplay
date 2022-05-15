/**
 * Abstract resource
 *
 * @author:
 **/

var Q = require("q"),
  db = require("../db/postgresql"),
  util = require("util");

module.exports = function (collectionName, req, schemaName) {
  this.req = req;

  function findInJson(options, single) {
    options = options || {};
    var deferred = Q.defer();
    var orderByParts = [],
      whereParts = [],
      values = [];

    if (options.filters) {
      for (var i = 0, l = options.filters.length; i < l; i++) {
        var filter = options.filters[i];
        values.push(filter.val);
        if (filter.field !== "id") {
          filter.field = "body->>'" + filter.field + "'";
        }
        whereParts.push(
          [filter.field, filter.op, "$" + values.length].join(" ")
        );
      }
    }

    if (options.sort) {
      for (var i = 0, l = options.sort.length; i < l; i++) {
        orderByParts.push(
          "body->>'" + options.sort[i].field + "' " + options.sort[i].order
        );
      }
    }

    var orderBy =
      orderByParts.length > 0 ? " ORDER BY " + orderByParts.join(", ") : "";
    var where =
      whereParts.length > 0 ? " WHERE " + whereParts.join(" AND ") : "";

    var sql =
      "select id, body from " +
      collectionName +
      where +
      orderBy +
      " LIMIT $" +
      (values.length + 1) +
      " OFFSET $" +
      (values.length + 2) +
      " ;";

    db.query(sql, values.concat([options.limit, options.offset]), req)
      .then(function (docs) {
        deferred.resolve(single && docs && docs.length > 0 ? docs[0] : docs);
      })
      .catch(function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  }

  function find(options, req, single) {
    options = options || {};
    var deferred = Q.defer();
    var orderByParts = [],
      whereParts = [],
      values = [];

    if (options.filters) {
      for (var i = 0, l = options.filters.length; i < l; i++) {
        var filter = options.filters[i];
        if (filter.condition) {
          whereParts.push(filter.condition);
        } else {
          values.push(filter.val);
          whereParts.push(
            util.format(' "%s" %s $%s ', filter.field, filter.op, values.length)
          );
        }
      }
    }

    if (options.sort) {
      for (var i = 0, l = options.sort.length; i < l; i++) {
        orderByParts.push(
          util.format(' "%s" %s ', options.sort[i].field, options.sort[i].order)
        );
      }
    }

    var orderBy =
      orderByParts.length > 0 ? " ORDER BY " + orderByParts.join(", ") : "";
    var where =
      whereParts.length > 0 ? " WHERE " + whereParts.join(" AND ") : "";

    var sql =
      "select * from " +
      collectionName +
      where +
      orderBy +
      " LIMIT $" +
      (values.length + 1) +
      " OFFSET $" +
      (values.length + 2) +
      " ;";
    db.query(sql, values.concat([options.limit, options.offset]), req)
      .then(function (docs) {
        deferred.resolve(single ? docs[0] : docs);
      })
      .catch(function (error) {
        deferred.reject(error);
      });
    return deferred.promise;
  }

  return {
    find: find,

    findOne: function (options, req) {
      options = options || {};
      options.limit = 1;
      options.offset = 0;
      return find(options, req, true);
    },

    findById: function (id, req) {
      var deferred = Q.defer();
      db.query("select * from " + collectionName + " where id=$1;", [id], req)
        .then(function (docs) {
          deferred.resolve(docs && docs.length > 0 ? docs[0] : null);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    },

    insert: function (document, req) {
      var deferred = Q.defer();
      var keys = [],
        values = [],
        placeholders = [];
      for (var k in document) {
        if (document.hasOwnProperty(k)) {
          keys.push('"' + k + '"');
          values.push(document[k]);
          placeholders.push("$" + (placeholders.length + 1));
        }
      }
      var sql = "insert into " + collectionName;
      if (keys.length > 0) {
        sql +=
          "(" +
          keys.join(", ") +
          ") values(" +
          placeholders.join(", ") +
          ") returning *;";
      } else {
        sql += " DEFAULT VALUES returning *;";
      }
      db.query(sql, values, req)
        .then(function (docs) {
          deferred.resolve(docs && docs.length > 0 ? docs[0] : null);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    },

    updateById: function (id, document, req) {
      var deferred = Q.defer();
      var fields = [],
        values = [];
      if (Object.keys(document).length == 0) {
        return [];
      }
      for (var k in document) {
        if (document.hasOwnProperty(k)) {
          if (
            document[k] &&
            typeof document[k] === "object" &&
            document[k].constructor.name != "Date"
          ) {
            fields.push(
              util.format(
                ' "%s"=jsonb_merge("%s", $%s) ',
                k,
                k,
                values.length + 1
              )
            );
          } else {
            fields.push('"' + k + '"=$' + (values.length + 1));
          }
          values.push(document[k]);
        }
      }
      var sql = "update " + collectionName + " set ";
      sql +=
        fields.join(", ") +
        " WHERE id = $" +
        (values.length + 1) +
        " returning *;";
      values.push(id);
      db.query(sql, values, req)
        .then(function (docs) {
          deferred.resolve(docs && docs.length > 0 ? docs[0] : null);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    },

    updateByCondition: function (condition, document, req) {
      var deferred = Q.defer();
      var fields = [],
        values = [],
        whereParts = [];
      if (Object.keys(document).length == 0) {
        return [];
      }
      for (var i = 0, l = condition.length; i < l; i++) {
        var filter = condition[i];
        values.push(filter.val);

        whereParts.push(
          util.format(' "%s" %s $%s ', filter.field, filter.op, values.length)
        );
      }
      for (var k in document) {
        if (document.hasOwnProperty(k)) {
          if (
            document[k] &&
            typeof document[k] === "object" &&
            document[k].constructor.name != "Date"
          ) {
            fields.push(
              util.format(
                ' "%s"=jsonb_merge("%s", $%s) ',
                k,
                k,
                values.length + 1
              )
            );
          } else {
            fields.push('"' + k + '"=$' + (values.length + 1));
          }
          values.push(document[k]);
        }
      }
      var sql = "update " + collectionName + " set ";
      var where =
        whereParts.length > 0 ? " WHERE " + whereParts.join(" AND ") : "";
      sql += fields.join(", ") + where + " returning *;";
      db.query(sql, values, req)
        .then(function (docs) {
          deferred.resolve(docs && docs.length > 0 ? docs[0] : null);
        })
        .catch(function (error) {
          req && req.logger.error({ error: error }, "updateByCondition");
          deferred.reject(error);
        });
      return deferred.promise;
    },

    deleteByCondition: function (condition, req) {
      var deferred = Q.defer();
      var fields = [],
        values = [],
        whereParts = [];
      for (var i = 0, l = condition.length; i < l; i++) {
        var filter = condition[i];
        values.push(filter.val);

        whereParts.push(
          util.format(' "%s" %s $%s ', filter.field, filter.op, values.length)
        );
      }
      var sql = "delete from " + collectionName;
      var where =
        whereParts.length > 0 ? " WHERE " + whereParts.join(" AND ") : "";
      sql += fields.join(", ") + where + " returning *;";
      db.query(sql, values, req)
        .then(function (docs) {
          deferred.resolve(docs && docs.length > 0 ? docs[0] : null);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    },

    deleteById: function (id, req) {
      return db.query(
        "DELETE from " + collectionName + "  WHERE id =$1",
        [id],
        req
      );
    },
  };
};
