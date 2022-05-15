var env = require("./environment");

module.exports = {
  env: env.INDIFI_ENV,
  db: {
    postgresql: {
      appConnection: env.APP_POSTGRESQL_CONNECTION,
      masterConnection: env.MASTER_POSTGRESQL_CONNECTION,
      maxPoolSize: 30,
      readReplica: env.APP_POSTGRESQL_READ_REPLICA,
      createPool: true,
    },
  },
};
