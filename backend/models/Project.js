const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  createdBy: String,
  members: [String] 
});

module.exports = mongoose.model("Project", projectSchema);