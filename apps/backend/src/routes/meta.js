const express = require("express");
const env = require("../config/env");

const router = express.Router();

router.get("/admin-display", function getAdminDisplayName(req, res) {
  res.json({
    displayName: env.adminDisplayName
  });
});

module.exports = router;
