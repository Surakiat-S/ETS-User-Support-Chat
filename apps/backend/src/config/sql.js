const sql = require("mssql");
const env = require("./env");

let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    const config = {
      server: env.sql.server,
      database: env.sql.database,
      user: env.sql.user,
      password: env.sql.password,
      connectionTimeout: 30000,
      requestTimeout: 30000,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      options: {
        encrypt: false,
        trustServerCertificate: true, // Changed to true for better compatibility with Node.js
        packetSize: 4096,
        enableArithAbort: true
      }
    };

    // Handle Port (e.g., HOST,PORT)
    if (config.server.includes(",")) {
      const parts = config.server.split(",");
      config.server = parts[0].trim();
      config.port = parseInt(parts[1].trim(), 10);
    }
    // Handle Named Instance (e.g., HOST\INSTANCE)
    else if (config.server.includes("\\")) {
      const parts = config.server.split("\\");
      config.server = parts[0].trim();
      config.options.instanceName = parts[1].trim();
    }

    poolPromise = sql.connect(config);
  }

  return poolPromise;
}

module.exports = {
  sql: sql,
  getPool: getPool
};
