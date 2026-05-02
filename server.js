const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); 
require("dotenv").config();
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const app = express();
app.use(cors()); 
app.use(express.json());
//here i have done database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server + DB working!");
});
//the signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    res.send("Login successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.post("/create-project", async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const newProject = new Project({
      name,
      createdBy,
      members: [createdBy]
    });
    await newProject.save();
    res.send("Project created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.post("/create-task", async (req, res) => {
  try {
    const { title, description, assignedTo, projectId } = req.body;

    const newTask = new Task({
      title,
      description,
      assignedTo,
      projectId
    });
    await newTask.save();
    res.send("Task created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/update-task", async (req, res) => {
  try {
    const { taskId, status } = req.body;
    await Task.findByIdAndUpdate(taskId, { status });
    res.send("Task updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.get("/test-signup", async (req, res) => {
  try {
    const newUser = new User({
      name: "Simran",
      email: "simran@test.com",
      password: "123456"
    });
    await newUser.save();
    res.send("Signup test success");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
app.get("/test-project", async (req, res) => {
  try {
    const newProject = new Project({
      name: "My First Project",
      createdBy: "simran@test.com",
      members: ["simran@test.com"]
    });
    await newProject.save();
    res.send("Project test success");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
app.get("/test-task", async (req, res) => {
  try {
    const newTask = new Task({
      title: "Test Task",
      description: "This is a test",
      assignedTo: "simran@test.com",
      projectId: "123"
    });
    await newTask.save();
    res.send("Task test success");
  } catch (err) {
    console.log(err);
    res.send("Error");
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.get("/dashboard", async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const todo = await Task.countDocuments({ status: "To Do" });
    const done = await Task.countDocuments({ status: "Done" });
    res.json({ total, todo, done });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
app.post("/delete-task", async (req, res) => {
  try {
    const { taskId } = req.body;
    await Task.findByIdAndDelete(taskId);
    res.send("Task deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});
const path = require("path");
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
