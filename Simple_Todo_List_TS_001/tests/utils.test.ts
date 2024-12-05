// Importing the functions to be tested
import {
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
} from '../src/scripts/utils';

// Mocking the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mocking DOM elements
document.body.innerHTML = `
  <form id="main-form">
    <input id="main-input" />
  </form>
  <ul id="main-list"></ul>
  <button id="del-all"></button>
`;

describe('Todo List Utility Functions', () => {
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

  test('eventListeners should attach event listeners', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    eventListeners();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3);
  });

  test('createNewTask should create a new task element', () => {
    createNewTask('Test Task', false);
    const taskElement = document.querySelector('.list-group-item');
    expect(taskElement).not.toBeNull();
    expect(taskElement.textContent).toContain('Test Task');
  });

  test('addNewItem should add a new task', () => {
    const event = { preventDefault: jest.fn() };
    const input = document.getElementById('main-input');
    input.value = 'New Task';
    addNewItem(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.querySelector('.list-group-item')).not.toBeNull();
  });

  test('addInnerTask should add an inner task', () => {
    addInnerTask('Upper Task', 'Inner Task', false);
    const innerTaskElement = document.querySelector('.under-list-item');
    expect(innerTaskElement).not.toBeNull();
    expect(innerTaskElement.textContent).toContain('Inner Task');
  });

  test('taskStufs should handle various task actions', () => {
    // This test would need to be expanded based on the specific actions in taskStufs
    const event = { target: { classList: { contains: jest.fn() } } };
    taskStufs(event);
    // Add assertions based on the expected behavior
  });

  test('deleteAll should remove all tasks', () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    const event = { preventDefault: jest.fn() };
    deleteAll(event);
    expect(document.querySelectorAll('.list-group-item').length).toBe(0);
  });

  test('loadLS should load tasks from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{ text: 'Loaded Task', check: false }]));
    loadLS();
    expect(document.querySelector('.list-group-item')).not.toBeNull();
  });

  test('loadInnerTasks should load inner tasks from localStorage', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{ upperTaskText: 'Upper', mainText: 'Inner', check: false }]));
    loadInnerTasks();
    expect(document.querySelector('.under-list-item')).not.toBeNull();
  });

  test('saveLS should save tasks to localStorage', () => {
    saveLS('New Task', 0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('saveInnerTasks should save inner tasks to localStorage', () => {
    saveInnerTasks({ upperTaskText: 'Upper', mainText: 'Inner', check: false }, 0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});