const { createNewTask, addNewItem, addInnerTask, taskStufs, deleteAll } = require('../src/scripts/todoList');
const { Storage } = require('../src/scripts/storage');

// Mock the Storage class
jest.mock('../src/scripts/storage');

describe('TodoList', () => {
  let mockStorage;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock instance of Storage
    mockStorage = {
      loadMainTasks: jest.fn(),
      loadInnerTasks: jest.fn(),
      saveMainTask: jest.fn(),
      saveInnerTask: jest.fn(),
      updateTaskCheck: jest.fn(),
      updateInnerTaskCheck: jest.fn(),
    };

    // Mock the getInstance method to return our mockStorage
    Storage.getInstance = jest.fn(() => mockStorage);

    // Mock DOM elements
    document.body.innerHTML = `
      <form id="mainForm">
        <input id="mainInput" />
      </form>
      <ul id="mainList"></ul>
      <button id="delAll"></button>
    `;
  });

  test('createNewTask should create a new task element', () => {
    createNewTask('Test Task', false);
    const taskElement = document.querySelector('.list-group-item');
    expect(taskElement).not.toBeNull();
    expect(taskElement.textContent).toContain('Test Task');
  });

  test('addNewItem should add a new task', () => {
    const event = { preventDefault: jest.fn() };
    document.getElementById('mainInput').value = 'New Task';
    addNewItem(event);
    expect(mockStorage.saveMainTask).toHaveBeenCalledWith('New Task', expect.any(Number));
    expect(document.getElementById('mainList').children.length).toBe(1);
  });

  test('addInnerTask should add an inner task', () => {
    addInnerTask('Upper Task', 'Inner Task', false);
    expect(mockStorage.saveInnerTask).toHaveBeenCalledWith(
      expect.objectContaining({
        upperTaskText: 'Upper Task',
        mainText: 'Inner Task',
        check: false
      }),
      expect.any(Number),
      'Upper Task'
    );
  });

  test('taskStufs should handle various task actions', () => {
    createNewTask('Test Task', false);
    const taskElement = document.querySelector('.list-group-item');
    
    // Test checking a task
    const checkBox = taskElement.querySelector('.form-check-input');
    checkBox.click();
    expect(mockStorage.updateTaskCheck).toHaveBeenCalledWith('Test Task', true);

    // Test deleting a task
    const deleteButton = taskElement.querySelector('.delete-item');
    deleteButton.click();
    expect(document.getElementById('mainList').children.length).toBe(0);

    // Test adding an inner task
    const addInnerButton = taskElement.querySelector('.add-inner-task');
    addInnerButton.click();
    expect(document.querySelector('.inner-form')).not.toBeNull();
  });

  test('deleteAll should remove all tasks', () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    expect(document.getElementById('mainList').children.length).toBe(2);

    const event = { preventDefault: jest.fn() };
    deleteAll(event);
    expect(document.getElementById('mainList').children.length).toBe(0);
  });
});