let tasks = [];

const addTask = () => {
    const taskInput = document.getElementById('taskinput');
    const dueDateInput = document.getElementById('duedateinput');
    const priorityInput = document.getElementById('priorityinput');
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (text) {
        tasks.push({ text: text, dueDate: dueDate, priority: priority, completed: false });
        taskInput.value = "";
        dueDateInput.value = "";
        priorityInput.value = "low";
        updateTasksList();
    }
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
        <div class="taskitem ${task.priority}">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})"/>
                <p>${task.text}</p>
                <p class="due-date">${task.dueDate}</p>
            </div>
            <div class="icons">
                <img src="edit.png" onclick="editTask(${index})" />
                <img src="delete.png" onclick="deleteTask(${index})" />
            </div>
        </div>`;
        taskList.append(listItem);

        checkDueDate(task);
    });

    updateStats();
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    sendNotification("Task Completed", `You have completed: ${tasks[index].text}`);
};

const editTask = (index) => {
    const newTask = prompt("Edit your task:", tasks[index].text);
    if (newTask !== null) {
        tasks[index].text = newTask.trim();
        updateTasksList();
    }
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
};

const updateStats = () => {
    const statsNumbers = document.getElementById('numbers');
    const completedTasks = tasks.filter(task => task.completed).length;
    statsNumbers.textContent = `${completedTasks} / ${tasks.length}`;

    const progressBar = document.getElementById('progressDone');
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
};

const checkDueDate = (task) => {
    const today = new Date().toISOString().split('T')[0];
    if (task.dueDate === today) {
        sendNotification("Task Due Today", `You have a task due today: ${task.text}`);
    }
};

const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
};

const requestNotificationPermission = () => {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }
};

document.getElementById('newtask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

requestNotificationPermission();
