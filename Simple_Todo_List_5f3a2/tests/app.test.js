// Mock DOM elements
const mockDOM = {
  getElementById: (id) => ({
    addEventListener: jest.fn(),
    children: [{ value: '' }],
    appendChild: jest.fn(),
    querySelector: jest.fn().mockReturnValue({ children: [] }),
    closest: jest.fn().mockReturnValue({ parentElement: { children: [{ innerText: 'Test Task' }] } }),
    classList: {
      remove: jest.fn(),
      toggle: jest.fn(),
    },
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    cloneNode: jest.fn().mockReturnValue({
      classList: { remove: jest.fn() },
      removeAttribute: jest.fn(),
      setAttribute: jest.fn(),
      children: [
        { setAttribute: jest.fn(), classList: { toggle: jest.fn() } },
        {},
        {},
        { setAttribute: jest.fn() },
      ],
    }),
  }),
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Mock implementation of the original code
let allTasks = [];
let innerTasks = [];
let count = 1;

const createNewTask = (text, check = false) => {
  const newLi = mockDOM.getElementById('upperLi').cloneNode(true);
  newLi.classList.remove('d-none');
  newLi.removeAttribute('id');
  newLi.children[0].setAttribute('href', `#collapse${count}`);
  newLi.children[0].classList.toggle('line-throught', check);
  newLi.children[0].innerText = text;
  newLi.children[3].setAttribute('id', `collapse${count}`);
  mockDOM.getElementById('mainList').children[0].appendChild(newLi);
  count++;
};

const addNewItem = (e) => {
  e.preventDefault();
  const taskText = mockDOM.getElementById('addingForm').children[0].value.trim();
  if (taskText) {
    allTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
    const taskExists = allTasks.some(item => item.text === taskText);
    if (taskExists) {
      console.log('Task Already Added');
    } else {
      createNewTask(taskText);
      saveLS(taskText, 1);
    }
  }
};

const saveLS = (text, index) => {
  if (index === -1) {
    mockLocalStorage.removeItem('allTasks');
    allTasks = [];
  } else if (index === 0) {
    allTasks = allTasks.filter(item => item.text !== text);
    mockLocalStorage.setItem('allTasks', JSON.stringify(allTasks));
    innerTasks = innerTasks.filter(item => item.upperTaskText !== text);
    mockLocalStorage.setItem('innerTasks', JSON.stringify(innerTasks));
  } else if (index === 1) {
    allTasks.push({ text, check: false });
    mockLocalStorage.setItem('allTasks', JSON.stringify(allTasks));
  }
};

const loadLS = () => {
  allTasks = JSON.parse(mockLocalStorage.getItem('allTasks') || '[]');
  allTasks.forEach(item => {
    if (item.text) {
      createNewTask(item.text, item.check);
    }
  });
};

// Test suite
describe('Todo List Application', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'document', { value: mockDOM });
    Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });
    allTasks = [];
    innerTasks = [];
    count = 1;
  });

  test('createNewTask should create a new task element', () => {
    createNewTask('Test Task');
    expect(mockDOM.getElementById('upperLi').cloneNode).toHaveBeenCalled();
    expect(mockDOM.getElementById('mainList').children[0].appendChild).toHaveBeenCalled();
  });

  test('addNewItem should add a new task', () => {
    const mockEvent = { preventDefault: jest.fn() };
    mockDOM.getElementById('addingForm').children[0].value = 'New Task';
    mockLocalStorage.getItem.mockReturnValue('[]');
    addNewItem(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('allTasks', '[{"text":"New Task","check":false}]');
  });

  test('addNewItem should not add duplicate task', () => {
    const mockEvent = { preventDefault: jest.fn() };
    mockDOM.getElementById('addingForm').children[0].value = 'Existing Task';
    mockLocalStorage.getItem.mockReturnValue('[{"text":"Existing Task","check":false}]');
    const consoleSpy = jest.spyOn(console, 'log');
    addNewItem(mockEvent);
    expect(consoleSpy).toHaveBeenCalledWith('Task Already Added');
    consoleSpy.mockRestore();
  });

  test('saveLS should save tasks to localStorage', () => {
    saveLS('New Task', 1);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('allTasks', '[{"text":"New Task","check":false}]');
  });

  test('loadLS should load tasks from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('[{"text":"Loaded Task","check":false}]');
    loadLS();
    expect(mockDOM.getElementById('upperLi').cloneNode).toHaveBeenCalled();
  });
});

// Run the tests
require('jest').run();