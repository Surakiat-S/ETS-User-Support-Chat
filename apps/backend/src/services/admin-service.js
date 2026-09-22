const sqlConfig = require("../config/sql");

function mapAdminProfile(record) {
  if (!record) {
    return null;
  }

  return {
    adminId: record.admin_id,
    username: record.username,
    displayName: record.display_name,
    role: record.role
  };
}

async function getActiveAdmins() {
  const pool = await sqlConfig.getPool();
  const result = await pool.request().query(
    "SELECT admin_id, username, display_name, role " +
      "FROM Admins WHERE status = 'Active' ORDER BY display_name ASC, username ASC;"
  );

  return result.recordset.map(mapAdminProfile);
}

async function getActiveAdminByUsername(username) {
  const pool = await sqlConfig.getPool();
  const request = pool.request();

  request.input("username", sqlConfig.sql.VarChar(100), username);

  const result = await request.query(
    "SELECT TOP 1 admin_id, username, display_name, role " +
      "FROM Admins WHERE username = @username AND status = 'Active';"
  );

  return mapAdminProfile(result.recordset[0]);
}

module.exports = {
  getActiveAdmins: getActiveAdmins,
  getActiveAdminByUsername: getActiveAdminByUsername
};
