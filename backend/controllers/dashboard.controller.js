const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

const dashboardController = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "verified" });
    const pendingTasks = await Task.countDocuments({ status: "open" });
    const totalUsers = await User.countDocuments();
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const tasksByProject = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalUsers,
      tasksByStatus,
      tasksByProject,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};

module.exports = dashboardController;  