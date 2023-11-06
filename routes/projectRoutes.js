const express = require("express");

const {
  createProject,
  getAllProjects,
  getProject,
  deleteProject
} = require("../controllers/projectController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/createProject", createProject);
router.get("/getAllProject", getAllProjects);
router.get("/getProject/:projectId", getProject);

router.use(requireAuth);
router.delete("/deleteProject/:projectId", deleteProject);

module.exports = router;
