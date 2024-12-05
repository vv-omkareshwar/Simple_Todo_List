const { createNewTask, addNewItem, addInnerTask, taskStuffs, deleteAll, loadLS, loadInnerTasks } = require('../src/scripts/todoList');
const { saveToLocalStorage, loadFromLocalStorage } = require('../src/scripts/utils');

// Mock the DOM elements
document.body.innerHTML = `
  <form id="main-form">
    <input id="main-input" type="text" />
  </form>
  <ul id="main-list"></ul>
  <button id="del-all"></button>
`;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Todo List Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    document.getElementById('main-list').innerHTML = '';
  });

  test('createNewTask adds a new task to the list', () => {
    createNewTask('Test Task');
    expect(document.getElementById('main-list').children.length).toBe(1);
    expect(document.getElementById('main-list').innerHTML).toContain('Test Task');
  });

  test('addNewItem creates a new task when form is submitted', () => {
    const event = { preventDefault: jest.fn() };
    document.getElementById('main-input').value = 'New Task';
    addNewItem(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.getElementById('main-list').children.length).toBe(1);
    expect(document.getElementById('main-list').innerHTML).toContain('New Task');
  });

  test('addInnerTask adds a subtask to an existing task', () => {
    createNewTask('Main Task');
    addInnerTask('Main Task', 'Sub Task');
    const mainTaskElement = document.getElementById('main-list').firstChild;
    expect(mainTaskElement.querySelector('.under-list-item')).toBeTruthy();
    expect(mainTaskElement.innerHTML).toContain('Sub Task');
  });

  test('taskStuffs handles various task actions', () => {
    createNewTask('Task to manipulate');
    const taskElement = document.getElementById('main-list').firstChild;
    
    // Test checking a task
    const checkEvent = { target: taskElement.querySelector('.form-check-input') };
    taskStuffs(checkEvent);
    expect(taskElement.classList.contains('line-throught')).toBeTruthy();

    // Test deleting a task
    const deleteEvent = { target: taskElement.querySelector('.delete-btn') };
    taskStuffs(deleteEvent);
    expect(document.getElementById('main-list').children.length).toBe(0);
  });

  test('deleteAll removes all tasks', () => {
    createNewTask('Task 1');
    createNewTask('Task 2');
    deleteAll({ preventDefault: jest.fn() });
    expect(document.getElementById('main-list').children.length).toBe(0);
    expect(localStorageMock.clear).toHaveBeenCalled();
  });

  test('loadLS loads tasks from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{ text: 'Loaded Task', check: false }]));
    loadLS();
    expect(document.getElementById('main-list').children.length).toBe(1);
    expect(document.getElementById('main-list').innerHTML).toContain('Loaded Task');
  });

  test('loadInnerTasks loads subtasks from localStorage', () => {
    createNewTask('Main Task');
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{ upperTaskText: 'Main Task', mainText: 'Loaded Sub Task', check: false }]));
    loadInnerTasks();
    const mainTaskElement = document.getElementById('main-list').firstChild;
    expect(mainTaskElement.querySelector('.under-list-item')).toBeTruthy();
    expect(mainTaskElement.innerHTML).toContain('Loaded Sub Task');
  });
});