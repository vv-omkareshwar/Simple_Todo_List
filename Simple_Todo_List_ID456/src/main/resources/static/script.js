// Function to fetch all todos from the server
async function fetchTodos() {
    try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Function to display todos in the UI
function displayTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="${todo.completed ? 'completed' : ''}">${todo.title}</span>
            <button onclick="toggleTodo(${todo.id})">${todo.completed ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

// Function to add a new todo
async function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const title = todoInput.value.trim();
    if (title) {
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todoInput.value = '';
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }
}

// Function to toggle todo completion status
async function toggleTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}/toggle`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchTodos();
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

// Function to delete a todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

// Initial fetch of todos when the page loads
document.addEventListener('DOMContentLoaded', fetchTodos);