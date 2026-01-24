const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;

    if (!title || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, project, and assignedTo are required" });
    }

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      project,
      assignedTo,
      priority: priority || "medium",
      dueDate: dueDate || undefined,
    });

    await task.populate("project", "title");
    await task.populate("assignedTo", "name email role");

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "user") {
      filter.assignedTo = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.project) {
      filter.project = req.query.project;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter)
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "title")
      .populate("assignedTo", "name email role")
      .populate("verifiedBy", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "user" && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only moderators and admins can update tasks fully
    if (req.user.role === "user") {
      return res.status(403).json({ message: "Not authorized to update tasks" });
    }

    // Verify project if being updated
    if (project && project !== task.project.toString()) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (project) task.project = project;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (status) task.status = status;

    const updated = await task.save();
    
    await updated.populate("project", "title");
    await updated.populate("assignedTo", "name email role");
    await updated.populate("verifiedBy", "name");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status, resolvedNote } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (req.user.role === "user" && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const validStatuses = ["open", "in-progress", "resolved", "verified"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status) task.status = status;
    if (resolvedNote) task.resolvedNote = resolvedNote;

    const updated = await task.save();
    
    await updated.populate("project", "title");
    await updated.populate("assignedTo", "name email role");
    await updated.populate("verifiedBy", "name");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "user") {
      return res.status(403).json({ message: "Not authorized to verify tasks" });
    }

    if (task.status !== "resolved") {
      return res.status(400).json({ message: "Task must be resolved before verification" });
    }

    task.status = "verified";
    task.verifiedBy = req.user._id;

    const updated = await task.save();
    
    await updated.populate("project", "title");
    await updated.populate("assignedTo", "name email role");
    await updated.populate("verifiedBy", "name");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "user") {
      return res.status(403).json({ message: "Not authorized to delete tasks" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  verifyTask,
  deleteTask,
};