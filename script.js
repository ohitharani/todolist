// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listener to the form to handle new tasks
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('new-task');
    const dateInput = document.getElementById('due-date');
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value;
    
    if (taskText !== '' && dueDate !== '') {
        addTask(taskText, dueDate);
        taskInput.value = ''; // Clear input after adding task
        dateInput.value = ''; // Clear date input after adding task
    }
});

// Function to add a task to the list
function addTask(taskText, dueDate, saveToLocalStorage = true) {
    const taskList = document.getElementById('task-list');
    
    const taskItem = document.createElement('li');
    
    // Create task content
    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');
    
    const taskTextElement = document.createElement('div');
    taskTextElement.classList.add('task-text');
    taskTextElement.innerText = taskText;
    
    const taskDeadlineElement = document.createElement('div');
    taskDeadlineElement.classList.add('task-deadline');
    taskDeadlineElement.innerText = `Due: ${formatDate(new Date(dueDate))}`;
    
    taskContent.appendChild(taskTextElement);
    taskContent.appendChild(taskDeadlineElement);
    
    // Append content to the task item
    taskItem.appendChild(taskContent);

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
    
    if (saveToLocalStorage) {
        saveTaskToLocalStorage(taskText, dueDate, taskItem.classList.contains('completed'));
    }
}

// Function to format the date
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}

// Function to save tasks to local storage
function saveTaskToLocalStorage(taskText, dueDate, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ taskText, dueDate, completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.taskText, task.dueDate, false, task.completed));
}

// Filter tasks
function filterTasks(filter) {
    const taskItems = document.querySelectorAll('#task-list li');
    
    taskItems.forEach(item => {
        const isCompleted = item.classList.contains('completed');
        const dueDate = new Date(item.querySelector('.task-deadline').innerText.replace('Due: ', ''));
        const now = new Date();
        const dueSoon = (dueDate - now) <= (24 * 60 * 60 * 1000);
        
        switch (filter) {
            case 'all':
                item.style.display = '';
                break;
            case 'active':
                item.style.display = isCompleted ? 'none' : '';
                break;
            case 'completed':
                item.style.display = isCompleted ? '' : 'none';
                break;
        }
        
        item.querySelector('.task-content').setAttribute('data-due-soon', dueSoon);
    });
}

// Update local storage
function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(item => {
        const taskText = item.querySelector('.task-text').innerText;
        const dueDate = item.querySelector('.task-deadline').innerText.replace('Due: ', '');
        const completed = item.classList.contains('completed');
        tasks.push({ taskText, dueDate, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Clear all tasks
document.getElementById('clear-tasks').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        document.getElementById('task-list').innerHTML = '';
        localStorage.removeItem('tasks');
    }
});
