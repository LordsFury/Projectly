const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", protect, dashboardController);

module.exports = router;
