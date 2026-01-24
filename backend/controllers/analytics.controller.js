const Project = require("../models/Project");
const Task = require("../models/Task");

const getAnalytics = async (req, res) => {
  try {
    const projectStatus = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskStatus = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const ticketsPerUser = await Task.aggregate([
      {
        $match: { status: { $in: ["resolved", "verified"] } },
      },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          count: 1,
        },
      },
    ]);

    const moderatorPerformance = await Project.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "project",
          as: "tasks",
        },
      },
      {
        $unwind: {
          path: "$tasks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$moderator",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [
                { $in: ["$tasks.status", ["resolved", "verified"]] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "moderator",
        },
      },
      { $unwind: "$moderator" },
      {
        $project: {
          _id: 0,
          moderatorId: "$moderator._id",
          name: "$moderator.name",
          totalTasks: 1,
          completedTasks: 1,
          performance: {
            $cond: [
              { $eq: ["$totalTasks", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$completedTasks", "$totalTasks"] },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);

    res.json({
      projectStatus,
      taskStatus,
      ticketsPerUser,
      moderatorPerformance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
