const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  status: {
    type: String,
    default: "To Do"
  },
  projectId: String
});

module.exports = mongoose.model("Task", taskSchema);