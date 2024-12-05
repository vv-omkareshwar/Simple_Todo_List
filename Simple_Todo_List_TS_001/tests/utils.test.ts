// Importing the functions to be tested
const {
  initializeApp,
  eventListeners,
  createNewTask,
  addNewItem,
  addInnerTask,
  taskStufs,
  deleteAll,
  loadLS,
  loadInnerTasks,
  saveLS,
  saveInnerTasks
} = require('../src/scripts/utils');

// Mock the DOM elements
document.body.innerHTML = `
  <form id="main-form">
    <input id="main-input" />
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
global.localStorage = localStorageMock;

describe('Todo List Utils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the DOM
    document.body.innerHTML = `
      <form id="main-form">
        <input id="main-input" />
      </form>
      <ul id="main-list"></ul>
      <button id="del-all"></button>
    `;
  });

  test('initializeApp calls loadLS and loadInnerTasks', () => {
    const loadLSSpy = jest.spyOn(global, 'loadLS');
    const loadInnerTasksSpy = jest.spyOn(global, 'loadInnerTasks');

    initializeApp();

    expect(loadLSSpy).toHaveBeenCalled();
    expect(loadInnerTasksSpy).toHaveBeenCalled();
  });

  test('createNewTask adds a new task to the list', () => {
    createNewTask('Test Task', false);
    const mainList = document.getElementById('main-list');
    expect(mainList.children.length).toBe(1);
    expect(mainList.children[0].textContent).toContain('Test Task');
  });

  test('addNewItem prevents default and calls createNewTask', () => {
    const event = { preventDefault: jest.fn() };
    const input = document.getElementById('main-input');
    input.value = 'New Task';

    addNewItem(event);

    expect(event.preventDefault).toHaveBeenCalled();
    const mainList = document.getElementById('main-list');
    expect(mainList.children.length).toBe(1);
    expect(mainList.children[0].textContent).toContain('New Task');
  });

  test('deleteAll removes all tasks', () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    const event = { preventDefault: jest.fn() };

    deleteAll(event);

    const mainList = document.getElementById('main-list');
    expect(mainList.children.length).toBe(0);
  });

  test('saveLS saves task to localStorage', () => {
    saveLS('Test Task', 0);
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify(['Test Task']));
  });

  test('loadLS loads tasks from localStorage', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify(['Task 1', 'Task 2']));
    loadLS();
    const mainList = document.getElementById('main-list');
    expect(mainList.children.length).toBe(2);
  });

  // Add more tests for other functions as needed
});