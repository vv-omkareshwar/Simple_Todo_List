// test_todo_list.js

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read and execute the todo_list.js file
const todoListJs = fs.readFileSync(path.resolve(__dirname, '../static/js/todo_list.js'), 'utf8');

describe('Todo List Tests', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Set up a DOM environment
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="app">
            <input id="taskInput" type="text">
            <button id="addTask">Add Task</button>
            <ul id="taskList"></ul>
          </div>
        </body>
      </html>
    `, { runScripts: 'dangerously' });

    document = dom.window.document;
    window = dom.window;

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Execute the todo_list.js in the mocked environment
    const script = document.createElement('script');
    script.textContent = todoListJs;
    document.body.appendChild(script);
  });

  test('Add a new task', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    taskInput.value = 'New Task';
    addTaskButton.click();

    expect(taskList.children.length).toBe(1);
    expect(taskList.firstChild.querySelector('.todo-text').textContent).toBe('New Task');
  });

  test('Mark task as completed', () => {
    // Add a task first
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    taskInput.value = 'Test Task';
    addTaskButton.click();

    const taskItem = document.querySelector('.todo-item');
    const checkbox = taskItem.querySelector('input[type="checkbox"]');

    checkbox.click();

    expect(taskItem.classList.contains('completed')).toBeTruthy();
  });

  test('Delete a task', () => {
    // Add a task first
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    taskInput.value = 'Task to Delete';
    addTaskButton.click();

    const deleteButton = document.querySelector('.delete-todo');
    deleteButton.click();

    expect(taskList.children.length).toBe(0);
  });

  test('Add a subtask', () => {
    // Add a main task first
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    taskInput.value = 'Main Task';
    addTaskButton.click();

    const addSubtaskButton = document.querySelector('.add-subtask');
    addSubtaskButton.click();

    const subtaskInput = document.querySelector('.subtask-input');
    const addSubtaskConfirmButton = document.querySelector('.confirm-subtask');

    subtaskInput.value = 'Subtask';
    addSubtaskConfirmButton.click();

    const subtaskList = document.querySelector('.subtask-list');
    expect(subtaskList.children.length).toBe(1);
    expect(subtaskList.firstChild.querySelector('.todo-text').textContent).toBe('Subtask');
  });

  test('Load tasks from localStorage', () => {
    // Mock localStorage data
    const mockTasks = JSON.stringify(['Task 1', 'Task 2']);
    window.localStorage.getItem.mockReturnValue(mockTasks);

    // Trigger load function (assuming it's called loadTasks in your actual code)
    window.loadTasks();

    const taskList = document.getElementById('taskList');
    expect(taskList.children.length).toBe(2);
    expect(taskList.children[0].querySelector('.todo-text').textContent).toBe('Task 1');
    expect(taskList.children[1].querySelector('.todo-text').textContent).toBe('Task 2');
  });
});