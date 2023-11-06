const express = require("express");
const {
  createComment,
  getAllComments,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/createComment", createComment);
router.get("/getAllComments", getAllComments);
router.get("/getComments/:projectId", getComments);

router.use(requireAuth);

router.delete("/deleteComment/:commentId", deleteComment);
module.exports = router;
