const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedUsers: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
});

projectSchema.statics.createProject = async function (
  projectName,
  category,
  details,
  createdDate,
  dueDate,
  createdBy,
  assignedUsers
) {
  // validation
  if (
    !projectName ||
    !category ||
    !details ||
    !createdDate ||
    !dueDate ||
    !createdBy
  ) {
    throw new Error("All fields must be filled");
  }
  try {
    const project = await this.create({
      projectName,
      category,
      details,
      createdDate,
      dueDate,
      createdBy,
      assignedUsers
    });

    return project;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Project", projectSchema);
