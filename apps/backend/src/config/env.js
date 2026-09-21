const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function readRequired(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }

  return value;
}

function readOrigins() {
  const raw = process.env.CLIENT_ORIGINS || "http://localhost:5173,http://localhost:3000";
  return raw
    .split(",")
    .map(function mapOrigin(value) {
      return value.trim();
    })
    .filter(Boolean);
}

module.exports = {
  port: Number(process.env.PORT || 5092),
  clientOrigins: readOrigins(),
  sql: {
    server: readRequired("SQL_SERVER"),
    database: readRequired("SQL_DATABASE"),
    user: readRequired("SQL_USER"),
    password: readRequired("SQL_PASSWORD"),
    trustServerCertificate: String(process.env.SQL_TRUST_CERT || "true").toLowerCase() === "true"
  },
  adminDisplayName: process.env.ADMIN_DISPLAY_NAME || "Support Admin"
};
