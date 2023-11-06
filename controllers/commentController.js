const Comment = require("../models/commentModel");

const createComment = async (req, res) => {
  const { comment, createdBy, project } = req.body;
  try {
    const commentCreated = await Comment.createComment(
      comment,
      createdBy,
      project
    );

    res.status(201).json({
      status: "success",
      data: { commentCreated },
      message: "Comment created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("createdBy");
    res.status(201).json({
      status: "success",
      data: { comments },
      message: "All comments fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const comments = await Comment.find({ project: projectId }).populate(
      "createdBy",
      "profileImage userName"
    );
    res.status(201).json({
      status: "success",
      data: { comments },
      message: " Comments fetched successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(400).json({ message: "comment does not exist" });
      // throw new Error ("comment does not exist")
    }

    if (comment.createdBy.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: "comment does not exist user failed" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    res.status(201).json({
      status: "success",
      data: { deletedComment },
      message: " Comment deleted successfully", 
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { createComment, getAllComments, getComments, deleteComment };
