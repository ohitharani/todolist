// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener to the form to handle new tasks
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const taskInput = document.getElementById('new-task');
    const deadlineInput = document.getElementById('task-deadline');
    const taskText = taskInput.value.trim();
    const taskDeadline = deadlineInput.value;
    
    if (taskText !== '' && taskDeadline !== '') {
        addTask(taskText, taskDeadline);
        taskInput.value = ''; // Clear input after adding task
        deadlineInput.value = ''; // Clear deadline input
    }
});

// Function to add a task to the list
function addTask(taskText, taskDeadline, saveToLocalStorage = true) {
    const taskList = document.getElementById('task-list');
    
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <span class="task-deadline">Due: ${taskDeadline}</span>
    `;

    // Add animation
    taskItem.style.opacity = 0;
    setTimeout(() => {
        taskItem.style.opacity = 1;
        taskItem.style.transform = 'scale(1)';
    }, 0);
    
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '✔';
    completeButton.classList.add('complete-btn');
    completeButton.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
        filterTasks(document.querySelector('.filter-btn.active').dataset.filter);
        updateLocalStorage();
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '✖';
    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                taskList.removeChild(taskItem);
                updateLocalStorage();
            }, 300);
        }
    });
    
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    
    taskList.appendChild(taskItem);

    // Save task to local storage if needed
    if (saveToLocalStorage) {
        updateLocalStorage();
    }
}

// Function to filter tasks
function filterTasks(filter) {
    const tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.classList.contains('completed') ? task.style.display = 'none' : task.style.display = 'flex';
                break;
            case 'completed':
                task.classList.contains('completed') ? task.style.display = 'flex' : task.style.display = 'none';
                break;
        }
    });
}

// Function to update local storage
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-text').textContent,
            deadline: task.querySelector('.task-deadline').textContent.replace('Due: ', ''),
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.text, task.deadline, false);
        if (task.completed) {
            const taskListItem = document.querySelector('#task-list li:last-child');
            taskListItem.classList.add('completed');
        }
    });
}

// Clear all tasks
document.getElementById('clear-tasks').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        document
