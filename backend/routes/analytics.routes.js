const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analytics.controller");
const { protect } = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.get("/", protect, authorizeRoles("admin", "moderator"), getAnalytics);

module.exports = router;
