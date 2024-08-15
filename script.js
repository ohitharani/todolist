document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        addTask(taskText);
        taskInput.value = ''; // Clear input after adding task
    }
});

function addTask(taskText) {
    const taskList = document.getElementById('task-list');
    
    const taskItem = document.createElement('li');
    taskItem.innerText = taskText;
    
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '✔';
    completeButton.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '✖';
    deleteButton.addEventListener('click', function() {
        taskList.removeChild(taskItem);
    });

    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}
