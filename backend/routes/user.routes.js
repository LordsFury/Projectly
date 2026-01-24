const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.use(protect);

router.get("/", authorizeRoles("admin", "moderator"), userController.getAllUsers);
router.get("/:id", authorizeRoles("admin"), userController.getUserById);
router.post("/", authorizeRoles("admin"), userController.createUser);
router.put("/:id/role", authorizeRoles("admin"), userController.updateUserRole);
router.put("/:id", authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", authorizeRoles("admin"), userController.deleteUser);

module.exports = router;