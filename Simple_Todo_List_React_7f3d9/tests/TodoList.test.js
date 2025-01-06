// Mock React and related hooks
const React = {
  useState: jest.fn(),
  useEffect: jest.fn()
};

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock TodoItem component
jest.mock('./TodoItem', () => {
  return jest.fn(() => null);
});

// Import the component to be tested
import TodoList from './TodoList';

// Test suite
describe('TodoList Component', () => {
  let setAllTasks;
  let setInnerTasks;
  let setMainInput;

  beforeEach(() => {
    setAllTasks = jest.fn();
    setInnerTasks = jest.fn();
    setMainInput = jest.fn();

    React.useState.mockImplementation((initialValue) => [initialValue, initialValue === '' ? setMainInput : initialValue === [] ? setAllTasks : setInnerTasks]);
    
    React.useEffect.mockImplementation(f => f());

    localStorage.clear();
  });

  test('loadLS loads tasks from localStorage', () => {
    const mockTasks = [{ text: 'Task 1', check: false }];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockTasks));

    const { loadLS } = TodoList();
    loadLS();

    expect(setAllTasks).toHaveBeenCalledWith(mockTasks);
  });

  test('loadInnerTasks loads inner tasks from localStorage', () => {
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false }];
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockInnerTasks));

    const { loadInnerTasks } = TodoList();
    loadInnerTasks();

    expect(setInnerTasks).toHaveBeenCalledWith(mockInnerTasks);
  });

  test('saveLS adds a new task', () => {
    const { saveLS } = TodoList();
    const newTask = 'New Task';
    saveLS(newTask, 1);

    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: newTask, check: false }]));
    expect(setAllTasks).toHaveBeenCalledWith([{ text: newTask, check: false }]);
  });

  test('saveInnerTasks adds a new inner task', () => {
    const { saveInnerTasks } = TodoList();
    const newInnerTask = { upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false };
    saveInnerTasks(newInnerTask, 1);

    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', JSON.stringify([newInnerTask]));
    expect(setInnerTasks).toHaveBeenCalledWith([newInnerTask]);
  });

  test('addNewItem adds a new task', () => {
    const { addNewItem } = TodoList();
    const mockEvent = { preventDefault: jest.fn() };
    const newTask = 'New Task';

    React.useState.mockReturnValueOnce([newTask, setMainInput]);
    React.useState.mockReturnValueOnce([[], setAllTasks]);

    addNewItem(mockEvent);

    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: newTask, check: false }]));
    expect(setAllTasks).toHaveBeenCalledWith([{ text: newTask, check: false }]);
    expect(setMainInput).toHaveBeenCalledWith('');
  });

  test('deleteAll removes all tasks', () => {
    const { deleteAll } = TodoList();

    deleteAll();

    expect(localStorage.removeItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.removeItem).toHaveBeenCalledWith('innerTasks');
    expect(setAllTasks).toHaveBeenCalledWith([]);
    expect(setInnerTasks).toHaveBeenCalledWith([]);
  });

  test('toggleTaskCheck toggles task check status', () => {
    const { toggleTaskCheck } = TodoList();
    const mockTasks = [{ text: 'Task 1', check: false }];
    React.useState.mockReturnValueOnce([mockTasks, setAllTasks]);

    toggleTaskCheck('Task 1');

    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'Task 1', check: true }]));
    expect(setAllTasks).toHaveBeenCalledWith([{ text: 'Task 1', check: true }]);
  });

  test('toggleInnerTaskCheck toggles inner task check status', () => {
    const { toggleInnerTaskCheck } = TodoList();
    const mockInnerTasks = [{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false }];
    React.useState.mockReturnValueOnce([mockInnerTasks, setInnerTasks]);

    toggleInnerTaskCheck('Task 1', 'Subtask 1');

    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', JSON.stringify([{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: true }]));
    expect(setInnerTasks).toHaveBeenCalledWith([{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: true }]);
  });

  test('addInnerTask adds a new inner task', () => {
    const { addInnerTask } = TodoList();
    const mockInnerTasks = [];
    React.useState.mockReturnValueOnce([mockInnerTasks, setInnerTasks]);

    addInnerTask('Task 1', 'Subtask 1');

    expect(localStorage.setItem).toHaveBeenCalledWith('innerTasks', JSON.stringify([{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false }]));
    expect(setInnerTasks).toHaveBeenCalledWith([{ upperTaskText: 'Task 1', mainText: 'Subtask 1', check: false }]);
  });
});