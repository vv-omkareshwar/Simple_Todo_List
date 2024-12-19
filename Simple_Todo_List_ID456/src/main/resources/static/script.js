// Function to add a new todo item
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    if (todoText) {
        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: todoText }),
        })
        .then(response => response.json())
        .then(todo => {
            appendTodoToList(todo);
            todoInput.value = '';
        })
        .catch(error => console.error('Error:', error));
    }
}

// Function to append a todo item to the list
function appendTodoToList(todo) {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
        <button onclick="toggleTodo(${todo.id})">Toggle</button>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
}

// Function to toggle the completion status of a todo item
function toggleTodo(id) {
    fetch(`/api/todos/${id}/toggle`, { method: 'PUT' })
        .then(response => response.json())
        .then(updatedTodo => {
            const todoItem = document.querySelector(`li:has(button[onclick="toggleTodo(${id})"])`);
            const span = todoItem.querySelector('span');
            span.classList.toggle('completed', updatedTodo.completed);
        })
        .catch(error => console.error('Error:', error));
}

// Function to delete a todo item
function deleteTodo(id) {
    fetch(`/api/todos/${id}`, { method: 'DELETE' })
        .then(() => {
            const todoItem = document.querySelector(`li:has(button[onclick="deleteTodo(${id})"])`);
            todoItem.remove();
        })
        .catch(error => console.error('Error:', error));
}

// Function to load all todo items
function loadTodos() {
    fetch('/api/todos')
        .then(response => response.json())
        .then(todos => {
            const todoList = document.getElementById('todoList');
            todoList.innerHTML = '';
            todos.forEach(todo => appendTodoToList(todo));
        })
        .catch(error => console.error('Error:', error));
}

// Load todos when the page is loaded
document.addEventListener('DOMContentLoaded', loadTodos);