// Mock implementation of localStorage
const mockLocalStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  clear: function() {
    this.store = {};
  }
};

// Mock implementation of document
const mockDocument = {
  createElement: function(tag) {
    return {
      classList: {
        add: function() {},
        remove: function() {}
      },
      setAttribute: function() {},
      appendChild: function() {}
    };
  }
};

// TodoService implementation
class TodoService {
  constructor() {
    this.allTasks = [];
    this.innerTasks = [];
    this.count = 1;
  }

  init() {
    this.loadTasks();
    this.loadInnerTasks();
  }

  createNewTask(text, check = false) {
    const newLi = mockDocument.createElement('li');
    this.count++;
    return newLi;
  }

  addNewTask(taskText) {
    if (taskText === '') return false;
    
    const existingTask = this.allTasks.find(task => task.text === taskText);
    if (existingTask) {
      console.warn('Task already exists');
      return false;
    }
    
    this.allTasks.push({ text: taskText, check: false });
    this.saveTasks();
    return true;
  }

  addInnerTask(upperText, mainText, check = false) {
    const innerLi = mockDocument.createElement('li');
    this.innerTasks.push({ upperTaskText: upperText, mainText: mainText, check: check });
    this.saveInnerTasks();
    return innerLi;
  }

  toggleTaskCheck(taskText, isInnerTask = false, upperText = '') {
    if (isInnerTask) {
      const innerTask = this.innerTasks.find(task => task.mainText === taskText && task.upperTaskText === upperText);
      if (innerTask) {
        innerTask.check = !innerTask.check;
        this.saveInnerTasks();
      }
    } else {
      const task = this.allTasks.find(task => task.text === taskText);
      if (task) {
        task.check = !task.check;
        this.saveTasks();
      }
    }
  }

  deleteTask(taskText, isInnerTask = false, upperText = '') {
    if (isInnerTask) {
      this.innerTasks = this.innerTasks.filter(task => !(task.mainText === taskText && task.upperTaskText === upperText));
      this.saveInnerTasks();
    } else {
      this.allTasks = this.allTasks.filter(task => task.text !== taskText);
      this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
      this.saveTasks();
      this.saveInnerTasks();
    }
  }

  deleteAllTasks() {
    this.allTasks = [];
    this.innerTasks = [];
    this.saveTasks();
    this.saveInnerTasks();
  }

  loadTasks() {
    const storedTasks = mockLocalStorage.getItem('allTasks');
    this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  loadInnerTasks() {
    const storedInnerTasks = mockLocalStorage.getItem('innerTasks');
    this.innerTasks = storedInnerTasks ? JSON.parse(storedInnerTasks) : [];
  }

  saveTasks() {
    mockLocalStorage.setItem('allTasks', JSON.stringify(this.allTasks));
  }

  saveInnerTasks() {
    mockLocalStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
  }
}

// Test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    mockLocalStorage.clear();
    todoService = new TodoService();
  });

  test('addNewTask should add a new task', () => {
    expect(todoService.addNewTask('Test task')).toBe(true);
    expect(todoService.allTasks).toHaveLength(1);
    expect(todoService.allTasks[0]).toEqual({ text: 'Test task', check: false });
  });

  test('addNewTask should not add duplicate task', () => {
    todoService.addNewTask('Test task');
    expect(todoService.addNewTask('Test task')).toBe(false);
    expect(todoService.allTasks).toHaveLength(1);
  });

  test('addInnerTask should add a new inner task', () => {
    todoService.addNewTask('Parent task');
    const innerTask = todoService.addInnerTask('Parent task', 'Inner task');
    expect(innerTask).toBeDefined();
    expect(todoService.innerTasks).toHaveLength(1);
    expect(todoService.innerTasks[0]).toEqual({ upperTaskText: 'Parent task', mainText: 'Inner task', check: false });
  });

  test('toggleTaskCheck should toggle task check state', () => {
    todoService.addNewTask('Test task');
    todoService.toggleTaskCheck('Test task');
    expect(todoService.allTasks[0].check).toBe(true);
    todoService.toggleTaskCheck('Test task');
    expect(todoService.allTasks[0].check).toBe(false);
  });

  test('toggleTaskCheck should toggle inner task check state', () => {
    todoService.addNewTask('Parent task');
    todoService.addInnerTask('Parent task', 'Inner task');
    todoService.toggleTaskCheck('Inner task', true, 'Parent task');
    expect(todoService.innerTasks[0].check).toBe(true);
    todoService.toggleTaskCheck('Inner task', true, 'Parent task');
    expect(todoService.innerTasks[0].check).toBe(false);
  });

  test('deleteTask should delete a task', () => {
    todoService.addNewTask('Test task');
    todoService.deleteTask('Test task');
    expect(todoService.allTasks).toHaveLength(0);
  });

  test('deleteTask should delete an inner task', () => {
    todoService.addNewTask('Parent task');
    todoService.addInnerTask('Parent task', 'Inner task');
    todoService.deleteTask('Inner task', true, 'Parent task');
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('deleteAllTasks should delete all tasks and inner tasks', () => {
    todoService.addNewTask('Task 1');
    todoService.addNewTask('Task 2');
    todoService.addInnerTask('Task 1', 'Inner task 1');
    todoService.deleteAllTasks();
    expect(todoService.allTasks).toHaveLength(0);
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('loadTasks should load tasks from localStorage', () => {
    mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Loaded task', check: false }]));
    todoService.loadTasks();
    expect(todoService.allTasks).toHaveLength(1);
    expect(todoService.allTasks[0]).toEqual({ text: 'Loaded task', check: false });
  });

  test('loadInnerTasks should load inner tasks from localStorage', () => {
    mockLocalStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Parent', mainText: 'Inner', check: true }]));
    todoService.loadInnerTasks();
    expect(todoService.innerTasks).toHaveLength(1);
    expect(todoService.innerTasks[0]).toEqual({ upperTaskText: 'Parent', mainText: 'Inner', check: true });
  });
});

// Run the tests
const describe = (name, fn) => {
  console.log(`\nTest Suite: ${name}`);
  fn();
};

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  },
  toEqual: (expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
  },
  toHaveLength: (expected) => {
    if (actual.length !== expected) {
      throw new Error(`Expected length ${expected}, but got ${actual.length}`);
    }
  },
  toBeDefined: () => {
    if (actual === undefined) {
      throw new Error('Expected value to be defined, but it was undefined');
    }
  },
});

const beforeEach = (fn) => {
  fn();
};

// Run the test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    mockLocalStorage.clear();
    todoService = new TodoService();
  });

  test('addNewTask should add a new task', () => {
    expect(todoService.addNewTask('Test task')).toBe(true);
    expect(todoService.allTasks).toHaveLength(1);
    expect(todoService.allTasks[0]).toEqual({ text: 'Test task', check: false });
  });

  test('addNewTask should not add duplicate task', () => {
    todoService.addNewTask('Test task');
    expect(todoService.addNewTask('Test task')).toBe(false);
    expect(todoService.allTasks).toHaveLength(1);
  });

  test('addInnerTask should add a new inner task', () => {
    todoService.addNewTask('Parent task');
    const innerTask = todoService.addInnerTask('Parent task', 'Inner task');
    expect(innerTask).toBeDefined();
    expect(todoService.innerTasks).toHaveLength(1);
    expect(todoService.innerTasks[0]).toEqual({ upperTaskText: 'Parent task', mainText: 'Inner task', check: false });
  });

  test('toggleTaskCheck should toggle task check state', () => {
    todoService.addNewTask('Test task');
    todoService.toggleTaskCheck('Test task');
    expect(todoService.allTasks[0].check).toBe(true);
    todoService.toggleTaskCheck('Test task');
    expect(todoService.allTasks[0].check).toBe(false);
  });

  test('toggleTaskCheck should toggle inner task check state', () => {
    todoService.addNewTask('Parent task');
    todoService.addInnerTask('Parent task', 'Inner task');
    todoService.toggleTaskCheck('Inner task', true, 'Parent task');
    expect(todoService.innerTasks[0].check).toBe(true);
    todoService.toggleTaskCheck('Inner task', true, 'Parent task');
    expect(todoService.innerTasks[0].check).toBe(false);
  });

  test('deleteTask should delete a task', () => {
    todoService.addNewTask('Test task');
    todoService.deleteTask('Test task');
    expect(todoService.allTasks).toHaveLength(0);
  });

  test('deleteTask should delete an inner task', () => {
    todoService.addNewTask('Parent task');
    todoService.addInnerTask('Parent task', 'Inner task');
    todoService.deleteTask('Inner task', true, 'Parent task');
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('deleteAllTasks should delete all tasks and inner tasks', () => {
    todoService.addNewTask('Task 1');
    todoService.addNewTask('Task 2');
    todoService.addInnerTask('Task 1', 'Inner task 1');
    todoService.deleteAllTasks();
    expect(todoService.allTasks).toHaveLength(0);
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('loadTasks should load tasks from localStorage', () => {
    mockLocalStorage.setItem('allTasks', JSON.stringify([{ text: 'Loaded task', check: false }]));
    todoService.loadTasks();
    expect(todoService.allTasks).toHaveLength(1);
    expect(todoService.allTasks[0]).toEqual({ text: 'Loaded task', check: false });
  });

  test('loadInnerTasks should load inner tasks from localStorage', () => {
    mockLocalStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Parent', mainText: 'Inner', check: true }]));
    todoService.loadInnerTasks();
    expect(todoService.innerTasks).toHaveLength(1);
    expect(todoService.innerTasks[0]).toEqual({ upperTaskText: 'Parent', mainText: 'Inner', check: true });
  });
});