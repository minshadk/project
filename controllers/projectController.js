const Project = require("../models/projectModel");

const createProject = async (req, res) => {
  const {
    projectName,
    category,
    details,
    createdDate,
    dueDate,
    createdBy,
    assignedUsers,
  } = req.body;
  try {
    const project = await Project.createProject(
      projectName,
      category,
      details,
      createdDate,
      dueDate,
      createdBy,
      assignedUsers
    );

    res.status(201).json({
      status: "success",
      data: { project },
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "assignedUsers",
      "profileImage userName"
      // 'profileImage email userName'
    );
    res.status(201).json({
      status: "success",
      data: { projects },
      message: "All project fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProject = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const project = await Project.findById(projectId).populate(
      "assignedUsers",
      "profileImage userName"
      // 'profileImage email userName'
    );
    res.status(201).json({
      status: "success",
      data: { project },
      message: " Project fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProject = async (req, res) => {
  const userId = req.user._id;
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(400).json({ message: "project does not exist" });
      // throw new Error ("project does not exist")
    }

    if (project.createdBy.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: "project does not exist user failed" });
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);
    res.status(201).json({
      status: "success",
      data: { deletedProject }, 
      message: " Project deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { createProject, getAllProjects, getProject, deleteProject };
