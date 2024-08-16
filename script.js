// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener to the form to handle new tasks
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('new-task');
    const taskDeadline = document.getElementById('task-deadline');
    const taskText = taskInput.value.trim();
    const deadline = taskDeadline.value; // Get the deadline value
    
    if (taskText !== '' && deadline !== '') {
        addTask(taskText, deadline);
        taskInput.value = ''; // Clear input after adding task
        taskDeadline.value = ''; // Clear deadline after adding task
    }
});

// Function to add a task to the list
function addTask(taskText, deadline, saveToLocalStorage = true) {
    const taskList = document.getElementById('task-list');
    
    const taskItem = document.createElement('li');
    
    // Create a div to hold task text and deadline
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');
    
    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.innerText = taskText;

    const taskDeadlineElement = document.createElement('span');
    taskDeadlineElement.classList.add('task-deadline');
    taskDeadlineElement.innerText = `Due: ${deadline}`;

    taskContent.appendChild(taskTextElement);
    taskContent.appendChild(taskDeadlineElement);
    
    taskItem.appendChild(taskContent);
    
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
        addTask(task.text, task.deadline, false);
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
        const taskContent = taskItem.querySelector('.task-content');
        const taskText = taskContent.querySelector('.task-text').textContent;
        const deadline = taskContent.querySelector('.task-deadline').textContent.replace('Due: ', ''); // Extract deadline from content
        const taskCompleted = taskItem.classList.contains('completed');
        tasks.push({ text: taskText, deadline: deadline, completed: taskCompleted });
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
