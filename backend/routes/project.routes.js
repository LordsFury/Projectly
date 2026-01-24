const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const { protect } = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
router.post("/", protect, authorizeRoles("moderator", "admin"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, authorizeRoles("moderator", "admin"), updateProject);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

module.exports = router;