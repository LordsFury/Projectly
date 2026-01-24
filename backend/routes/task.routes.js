const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  verifyTask,
  deleteTask,
} = require("../controllers/task.controller");

const { protect } = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.use(protect);

router.post("/", authorizeRoles("moderator", "admin"), createTask);
router.get("/", getTasks); 
router.get("/:id", getTask);
router.put("/:id", authorizeRoles("moderator", "admin"), updateTask);
router.delete("/:id", authorizeRoles("admin", "moderator"), deleteTask);
router.patch("/:id/status", updateTaskStatus); 
router.patch("/:id/verify", authorizeRoles("moderator", "admin"), verifyTask);

module.exports = router;