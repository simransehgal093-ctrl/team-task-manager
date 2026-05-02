
const API = "http://localhost:5000";

//login
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }
  fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);

    if (data === "Login successful") {
      window.location.href = "dashboard.html";
    }
  });
}
// creating project
function createProject() {
  const name = document.getElementById("projectName").value.trim();
  if (!name) {
    alert("Enter project name");
    return;
  }
  fetch(API + "/create-project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      createdBy: "simran@test.com"
    })
  })
  .then(res => res.text())
  .then(data => alert(data));
}
//creating task
function createTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDesc").value.trim();
  const assignedTo = document.getElementById("assignedTo").value.trim();
  const projectId = document.getElementById("projectId").value.trim();

  if (!title || !assignedTo || !projectId) {
    alert("Fill all required fields");
    return;
  }
  fetch(API + "/create-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title,
      description,
      assignedTo,
      projectId
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadTasks();
    loadStats();
  });
}
//load task
function loadTasks() {
  fetch(API + "/tasks")
    .then(res => res.json())
    .then(data => {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";
      data.forEach(task => {
        const div = document.createElement("div");
        div.innerHTML = `
          <b>${task.title}</b><br>
          ${task.description}<br>
          Assigned: ${task.assignedTo}<br>
          Status: ${task.status}<br><br>

          ${
            task.status !== "Done"
              ? `<button onclick="markDone('${task._id}')">Mark Done</button>`
              : `<span style="color:green;">✔ Completed</span>`
          }
          <button onclick="deleteTask('${task._id}')" style="background:red; margin-left:10px;">
            Delete
          </button>
        `;
        taskList.appendChild(div);
      });
    });
}
//stats load
function loadStats() {
  fetch(API + "/dashboard")
    .then(res => res.json())
    .then(data => {
      document.getElementById("totalCount").innerText = data.total;
      document.getElementById("todoCount").innerText = data.todo;
      document.getElementById("doneCount").innerText = data.done;
    });
}
//marking of done
function markDone(id) {
  fetch(API + "/update-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      taskId: id,
      status: "Done"
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadTasks();
    loadStats();
  });
}
//deleting of task
function deleteTask(id) {
  fetch(API + "/delete-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ taskId: id })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    loadTasks();
    loadStats();
  });
}