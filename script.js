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
    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                taskList.removeChild(taskItem);
