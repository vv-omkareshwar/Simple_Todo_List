// Function to add a new todo item
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    
    if (todoText !== '') {
        const todoList = document.getElementById('todoList');
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todoText}</span>
            <button onclick="removeTodo(this)">Remove</button>
        `;
        todoList.appendChild(li);
        todoInput.value = '';
    }
}

// Function to remove a todo item
function removeTodo(button) {
    const li = button.parentElement;
    li.remove();
}

// Event listener for the add button
document.getElementById('addButton').addEventListener('click', addTodo);

// Event listener for the Enter key in the input field
document.getElementById('todoInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
});