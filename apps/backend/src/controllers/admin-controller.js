const adminService = require("../services/admin-service");

async function listAdmins(req, res, next) {
  try {
    const admins = await adminService.getActiveAdmins();
    res.json(admins.map(function mapAdmin(admin) {
      return {
        admin_id: admin.adminId,
        username: admin.username,
        display_name: admin.displayName
      };
    }));
  } catch (error) {
    next(error);
  }
}

async function loginMock(req, res, next) {
  try {
    const username = String(req.body.username || "").trim();

    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    const admin = await adminService.getActiveAdminByUsername(username);

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.json({
      admin_id: admin.adminId,
      username: admin.username,
      display_name: admin.displayName,
      role: admin.role
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAdmins: listAdmins,
  loginMock: loginMock
};
