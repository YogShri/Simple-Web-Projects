document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let input = document.getElementById("taskInput");
    let taskText = input.value.trim();

    if (taskText === "") return;

    createTaskElement(taskText);
    saveTask(taskText);

    input.value = "";
}

function createTaskElement(taskText, completed = false) {
    let ul = document.getElementById("taskList");

    let li = document.createElement("li");
    li.className = "task-item";
    if (completed) li.classList.add("completed");

    li.innerHTML = `
        <input type="checkbox" class="check" ${completed ? "checked" : ""} />
        <span class="task-text">${taskText}</span>
        <div class="controls">
            <span class="icon-btn edit">✏️</span>
            <span class="icon-btn delete">🗑️</span>
        </div>
    `;

    // Checkbox event
    li.querySelector(".check").addEventListener("change", function () {
        li.classList.toggle("completed");
        updateStorage();
    });

    // Delete button
    li.querySelector(".delete").addEventListener("click", function () {
        li.remove();
        updateStorage();
    });

    // Edit button
    li.querySelector(".edit").addEventListener("click", function () {
        let newText = prompt("Edit Task:", taskText);
        if (newText) {
            li.querySelector(".task-text").textContent = newText;
            updateStorage();
        }
    });

    ul.appendChild(li);
}

function saveTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
}

function updateStorage() {
    let items = document.querySelectorAll(".task-item");
    let tasks = [];

    items.forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAll() {
    document.getElementById("taskList").innerHTML = "";
    localStorage.removeItem("tasks");
}
