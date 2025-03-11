// DOM Elements
const dateElement = document.getElementById('date');
const taskInput = document.getElementById('taskInput');
const timeInput = document.getElementById('timeInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAll');

// Set current date
function setDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task));
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(taskElement => ({
        text: taskElement.querySelector('.task-content span').textContent,
        time: taskElement.querySelector('.task-time').textContent,
        completed: taskElement.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create new task element
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item' + (task.completed ? ' completed' : '');
    
    taskElement.innerHTML = `
        <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <span class="task-time">${task.time}</span>
        </div>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;

    // Add event listeners
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        taskElement.classList.toggle('completed');
        saveTasks();
    });

    const deleteBtn = taskElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        taskElement.remove();
        saveTasks();
    });

    // Insert task in correct time order
    const taskTime = task.time;
    let inserted = false;
    
    for (const existingTask of taskList.children) {
        const existingTime = existingTask.querySelector('.task-time').textContent;
        if (taskTime < existingTime) {
            taskList.insertBefore(taskElement, existingTask);
            inserted = true;
            break;
        }
    }
    
    if (!inserted) {
        taskList.appendChild(taskElement);
    }
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    const time = timeInput.value;
    
    if (text && time) {
        createTaskElement({ text, time, completed: false });
        saveTasks();
        
        // Clear inputs
        taskInput.value = '';
        timeInput.value = '';
    }
}

// Clear all tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
    }
}

// Event listeners
addTaskBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);

// Initialize
setDate();
loadTasks();

// Add keyboard shortcut for adding tasks
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim() && timeInput.value) {
        addTask();
    }
});