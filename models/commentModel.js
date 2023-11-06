const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.statics.createComment = async function (comment, createdBy, project) {
  if (!comment || !createdBy || !project) {
    throw new Error("All fields must be filled");
  }
  try {
    const commentCreated = await this.create({
      comment,
      createdBy,
      project,
    });

    return commentCreated;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Comment", commentSchema);
