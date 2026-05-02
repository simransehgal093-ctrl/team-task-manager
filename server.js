const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();
const path=require("path");
const User=require("./User");
const Project=require("./Project");
const Task=require("./Task");
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.get("/",(req,res)=>{
res.send("Server + DB working!");
});

app.post("/signup",async(req,res)=>{
try{
const {name,email,password}=req.body;
const newUser=new User({name,email,password});
await newUser.save();
res.send("User registered successfully");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.post("/login",async(req,res)=>{
try{
const {email,password}=req.body;
const user=await User.findOne({email,password});
if(!user){
return res.status(400).send("Invalid credentials");
}
res.send("Login successful");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.post("/create-project",async(req,res)=>{
try{
const {name,createdBy}=req.body;
const newProject=new Project({name,createdBy,members:[createdBy]});
await newProject.save();
res.send("Project created successfully");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.post("/create-task",async(req,res)=>{
try{
const {title,description,assignedTo,projectId}=req.body;
const newTask=new Task({title,description,assignedTo,projectId});
await newTask.save();
res.send("Task created successfully");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.post("/update-task",async(req,res)=>{
try{
const {taskId,status}=req.body;
await Task.findByIdAndUpdate(taskId,{status});
res.send("Task updated");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.post("/delete-task",async(req,res)=>{
try{
const {taskId}=req.body;
await Task.findByIdAndDelete(taskId);
res.send("Task deleted");
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.get("/tasks",async(req,res)=>{
try{
const tasks=await Task.find();
res.json(tasks);
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.get("/dashboard",async(req,res)=>{
try{
const total=await Task.countDocuments();
const todo=await Task.countDocuments({status:"To Do"});
const done=await Task.countDocuments({status:"Done"});
res.json({total,todo,done});
}catch(err){
console.log(err);
res.status(500).send("Error");
}
});

app.get("/test-signup",async(req,res)=>{
try{
const newUser=new User({name:"Simran",email:"simran@test.com",password:"123456"});
await newUser.save();
res.send("Signup test success");
}catch(err){
console.log(err);
res.send("Error");
}
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});
