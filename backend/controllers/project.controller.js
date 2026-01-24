const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {
    const { title, description, status, moderator, members } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!moderator) {
      return res.status(400).json({ message: "Moderator is required" });
    }

    const moderatorUser = await User.findById(moderator);
    if (!moderatorUser) {
      return res.status(404).json({ message: "Moderator not found" });
    }

    if (moderatorUser.role !== "moderator" && moderatorUser.role !== "admin") {
      return res.status(400).json({ message: "Selected user must be a moderator or admin" });
    }

    const project = await Project.create({
      title,
      description: description || "",
      status: status || "active",
      moderator,
      members: members || [],
    });

    await project.populate("moderator", "name email role");
    await project.populate("members", "name email role");

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "user") {
      filter.members = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter)
      .populate("moderator", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, status, moderator, members } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (moderator && moderator !== project.moderator.toString()) {
      const moderatorUser = await User.findById(moderator);
      if (!moderatorUser) {
        return res.status(404).json({ message: "Moderator not found" });
      }
      if (moderatorUser.role !== "moderator" && moderatorUser.role !== "admin") {
        return res.status(400).json({ message: "Selected user must be a moderator or admin" });
      }
      project.moderator = moderator;
    }

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (members !== undefined) project.members = members;

    const updated = await project.save();
    await updated.populate("moderator", "name email role");
    await updated.populate("members", "name email role");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};