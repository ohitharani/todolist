// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener to the form to handle new tasks
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = ''; // Clear input after adding task
    }
});

// Function to add a task to the list
function addTask(taskText, saveToLocalStorage = true) {
    const taskList = document.getElementById('task-list');
    
    const taskItem = document.createElement('li');
    taskItem.innerText = taskText;

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
    deleteButton.classList.add('delete-btn');
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

    if (saveToLocalStorage) {
        updateLocalStorage();
    }
}

// Function to load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTask(task.text, false);
        if (task.completed) {
            const taskItem = document.getElementById('task-list').lastChild;
            taskItem.classList.add('completed');
        }
    });
}

// Function to update local storage
function updateLocalStorage() {
    const taskItems = document.querySelectorAll('#task-list li');
    const tasks = [];

    taskItems.forEach(taskItem => {
        const taskText = taskItem.firstChild.textContent;
        const taskCompleted = taskItem.classList.contains('completed');
        tasks.push({ text: taskText, completed: taskCompleted });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to filter tasks based on the selected filter
function filterTasks(filter) {
    const taskItems = document.querySelectorAll('#task-list li');

    taskItems.forEach(taskItem => {
        switch (filter) {
            case 'all':
                taskItem.style.display = '';
                break;
            case 'active':
                taskItem.style.display = taskItem.classList.contains('completed') ? 'none' : '';
                break;
            case 'completed':
                taskItem.style.display = taskItem.classList.contains('completed') ? '' : 'none';
                break;
        }
    });
}

// Add event listener to filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelector('.filter-btn.active').classList.remove('active');
        this.classList.add('active');
        filterTasks(this.dataset.filter);
    });
});

// Add event listener to the "Clear All Tasks" button
document.getElementById('clear-tasks').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        const taskList = document.getElementById('task-list');
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }
        updateLocalStorage();
    }
});
