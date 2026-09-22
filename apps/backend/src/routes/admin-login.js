const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

router.post("/login-mock", adminController.loginMock);

module.exports = router;
