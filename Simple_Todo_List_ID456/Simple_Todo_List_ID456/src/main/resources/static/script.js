// Function to fetch all todos from the server
async function fetchTodos() {
    try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        displayError('Failed to load todos. Please try again later.');
    }
}

// Function to display todos in the UI
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        if (todo.completed) {
            li.classList.add('completed');
        }
        li.onclick = () => toggleTodoStatus(todo.id, !todo.completed);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        };
        
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// Function to add a new todo
async function addTodo(event) {
    event.preventDefault();
    const titleInput = document.getElementById('new-todo');
    const title = titleInput.value.trim();
    
    if (!title) {
        displayError('Please enter a todo title');
        return;
    }
    
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, completed: false }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to add todo');
        }
        
        titleInput.value = '';
        fetchTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
        displayError('Failed to add todo. Please try again.');
    }
}

// Function to toggle todo status
async function toggleTodoStatus(id, completed) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update todo status');
        }
        
        fetchTodos();
    } catch (error) {
        console.error('Error updating todo status:', error);
        displayError('Failed to update todo status. Please try again.');
    }
}

// Function to delete a todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        
        fetchTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
        displayError('Failed to delete todo. Please try again.');
    }
}

// Function to display error messages
function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', fetchTodos);
document.getElementById('todo-form').addEventListener('submit', addTodo);