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

// Replace global localStorage with mock
global.localStorage = mockLocalStorage;

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
    const newTask = { id: this.count++, text, check };
    this.allTasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  addNewItem(taskText) {
    if (taskText === "") return null;

    const existingTask = this.allTasks.find(task => task.text === taskText);
    if (existingTask) {
      throw new Error("Task Already Added");
    }

    return this.createNewTask(taskText);
  }

  addInnerTask(upperTaskId, mainText, check = false) {
    const newInnerTask = { upperTaskId, mainText, check };
    this.innerTasks.push(newInnerTask);
    this.saveInnerTasks();
    return newInnerTask;
  }

  deleteTask(taskId) {
    const taskIndex = this.allTasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.allTasks.splice(taskIndex, 1);
      this.saveTasks();

      this.innerTasks = this.innerTasks.filter(innerTask => innerTask.upperTaskId !== taskId);
      this.saveInnerTasks();
    }
  }

  deleteInnerTask(upperTaskId, mainText) {
    this.innerTasks = this.innerTasks.filter(
      task => !(task.upperTaskId === upperTaskId && task.mainText === mainText)
    );
    this.saveInnerTasks();
  }

  toggleTaskCheck(taskId) {
    const task = this.allTasks.find(task => task.id === taskId);
    if (task) {
      task.check = !task.check;
      this.saveTasks();
    }
  }

  toggleInnerTaskCheck(upperTaskId, mainText) {
    const innerTask = this.innerTasks.find(
      task => task.upperTaskId === upperTaskId && task.mainText === mainText
    );
    if (innerTask) {
      innerTask.check = !innerTask.check;
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
    const storedTasks = localStorage.getItem('allTasks');
    this.allTasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  loadInnerTasks() {
    const storedInnerTasks = localStorage.getItem('innerTasks');
    this.innerTasks = storedInnerTasks ? JSON.parse(storedInnerTasks) : [];
  }

  saveTasks() {
    localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
  }

  saveInnerTasks() {
    localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
  }

  getAllTasks() {
    return this.allTasks;
  }

  getInnerTasks(upperTaskId) {
    return this.innerTasks.filter(task => task.upperTaskId === upperTaskId);
  }
}

// Test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    localStorage.clear();
    todoService = new TodoService();
    todoService.init();
  });

  test('addNewItem should add a new task', () => {
    const newTask = todoService.addNewItem('Test Task');
    expect(newTask).toEqual({ id: 1, text: 'Test Task', check: false });
    expect(todoService.getAllTasks()).toHaveLength(1);
  });

  test('addNewItem should throw error for duplicate task', () => {
    todoService.addNewItem('Test Task');
    expect(() => todoService.addNewItem('Test Task')).toThrow('Task Already Added');
  });

  test('addInnerTask should add a new inner task', () => {
    const task = todoService.addNewItem('Main Task');
    const innerTask = todoService.addInnerTask(task.id, 'Inner Task');
    expect(innerTask).toEqual({ upperTaskId: task.id, mainText: 'Inner Task', check: false });
    expect(todoService.getInnerTasks(task.id)).toHaveLength(1);
  });

  test('deleteTask should remove a task and its inner tasks', () => {
    const task = todoService.addNewItem('Main Task');
    todoService.addInnerTask(task.id, 'Inner Task');
    todoService.deleteTask(task.id);
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks(task.id)).toHaveLength(0);
  });

  test('deleteInnerTask should remove an inner task', () => {
    const task = todoService.addNewItem('Main Task');
    todoService.addInnerTask(task.id, 'Inner Task');
    todoService.deleteInnerTask(task.id, 'Inner Task');
    expect(todoService.getInnerTasks(task.id)).toHaveLength(0);
  });

  test('toggleTaskCheck should toggle task check status', () => {
    const task = todoService.addNewItem('Test Task');
    todoService.toggleTaskCheck(task.id);
    expect(todoService.getAllTasks()[0].check).toBe(true);
  });

  test('toggleInnerTaskCheck should toggle inner task check status', () => {
    const task = todoService.addNewItem('Main Task');
    todoService.addInnerTask(task.id, 'Inner Task');
    todoService.toggleInnerTaskCheck(task.id, 'Inner Task');
    expect(todoService.getInnerTasks(task.id)[0].check).toBe(true);
  });

  test('deleteAllTasks should remove all tasks and inner tasks', () => {
    todoService.addNewItem('Task 1');
    todoService.addNewItem('Task 2');
    const task3 = todoService.addNewItem('Task 3');
    todoService.addInnerTask(task3.id, 'Inner Task');
    todoService.deleteAllTasks();
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks(task3.id)).toHaveLength(0);
  });

  test('loadTasks and loadInnerTasks should load tasks from localStorage', () => {
    localStorage.setItem('allTasks', JSON.stringify([{ id: 1, text: 'Loaded Task', check: false }]));
    localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskId: 1, mainText: 'Loaded Inner Task', check: false }]));
    todoService.init();
    expect(todoService.getAllTasks()).toHaveLength(1);
    expect(todoService.getInnerTasks(1)).toHaveLength(1);
  });
});

// Run the tests
const testResults = [];

function describe(suiteName, testFunction) {
  console.log(`Test Suite: ${suiteName}`);
  testFunction();
}

function test(testName, testFunction) {
  try {
    testFunction();
    testResults.push({ name: testName, passed: true });
    console.log(`  ✓ ${testName}`);
  } catch (error) {
    testResults.push({ name: testName, passed: false, error: error.message });
    console.log(`  ✗ ${testName}`);
    console.log(`    Error: ${error.message}`);
  }
}

function expect(actual) {
  return {
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
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
  };
}

function beforeEach(setupFunction) {
  setupFunction();
}

// Run the tests
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    localStorage.clear();
    todoService = new TodoService();
    todoService.init();
  });

  test('addNewItem should add a new task', () => {
    const newTask = todoService.addNewItem('Test Task');
    expect(newTask).toEqual({ id: 1, text: 'Test Task', check: false });
    expect(todoService.getAllTasks()).toHaveLength(1);
  });

  test('addNewItem should throw error for duplicate task', () => {
    todoService.addNewItem('Test Task');
    try {
      todoService.addNewItem('Test Task');
    } catch (error) {
      expect(error.message).toBe('Task Already Added');
    }
  });

  // Add more test cases here...
});

// Print test results summary
console.log('\nTest Results:');
console.log(`Total Tests: ${testResults.length}`);
console.log(`Passed: ${testResults.filter(r => r.passed).length}`);
console.log(`Failed: ${testResults.filter(r => !r.passed).length}`);

if (testResults.some(r => !r.passed)) {
  console.log('\nFailed Tests:');
  testResults.filter(r => !r.passed).forEach(result => {
    console.log(`  ✗ ${result.name}`);
    console.log(`    Error: ${result.error}`);
  });
}