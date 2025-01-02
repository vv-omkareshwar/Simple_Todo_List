// Mock implementation of localStorage
const mockLocalStorage = {
  storage: {},
  setItem: function(key, value) {
    this.storage[key] = value;
  },
  getItem: function(key) {
    return this.storage[key] || null;
  },
  removeItem: function(key) {
    delete this.storage[key];
  },
  clear: function() {
    this.storage = {};
  }
};

// Assign mock localStorage to global object
global.localStorage = mockLocalStorage;

// TodoService implementation
class TodoService {
  constructor() {
    this.allTasks = [];
    this.innerTasks = [];
    this.count = 1;
  }

  loadTasks() {
    this.loadMainTasks();
    this.loadInnerTasks();
  }

  loadMainTasks() {
    if (localStorage.getItem("allTasks") === null) {
      localStorage.setItem("allTasks", JSON.stringify(this.allTasks));
    } else {
      this.allTasks = JSON.parse(localStorage.getItem("allTasks"));
    }
  }

  loadInnerTasks() {
    if (localStorage.getItem("innerTasks") === null) {
      localStorage.setItem("innerTasks", JSON.stringify(this.innerTasks));
    } else {
      this.innerTasks = JSON.parse(localStorage.getItem("innerTasks"));
    }
  }

  addTask(taskText) {
    if (taskText !== "") {
      const existingTask = this.allTasks.find(task => task.text === taskText);
      if (existingTask) {
        throw new Error("Task Already Added");
      }
      const newTask = { text: taskText, check: false };
      this.allTasks.push(newTask);
      this.saveMainTasks();
      return newTask;
    }
    return null;
  }

  addInnerTask(upperTaskText, innerTaskText) {
    if (innerTaskText !== "") {
      const existingInnerTask = this.innerTasks.find(
        task => task.upperTaskText === upperTaskText && task.mainText === innerTaskText
      );
      if (existingInnerTask) {
        throw new Error("Inner Task Already Added");
      }
      const newInnerTask = { upperTaskText, mainText: innerTaskText, check: false };
      this.innerTasks.push(newInnerTask);
      this.saveInnerTasks();
      return newInnerTask;
    }
    return null;
  }

  toggleTaskCheck(taskText, isInnerTask = false, upperTaskText = "") {
    let tasks = isInnerTask ? this.innerTasks : this.allTasks;
    let taskToToggle = isInnerTask
      ? tasks.find(task => task.mainText === taskText && task.upperTaskText === upperTaskText)
      : tasks.find(task => task.text === taskText);

    if (taskToToggle) {
      taskToToggle.check = !taskToToggle.check;
      this.saveMainTasks();
      if (isInnerTask) this.saveInnerTasks();
      return taskToToggle;
    }
    return null;
  }

  deleteTask(taskText) {
    const index = this.allTasks.findIndex(task => task.text === taskText);
    if (index !== -1) {
      this.allTasks.splice(index, 1);
      this.saveMainTasks();
      this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
      this.saveInnerTasks();
      return true;
    }
    return false;
  }

  deleteInnerTask(upperTaskText, innerTaskText) {
    const index = this.innerTasks.findIndex(
      task => task.upperTaskText === upperTaskText && task.mainText === innerTaskText
    );
    if (index !== -1) {
      this.innerTasks.splice(index, 1);
      this.saveInnerTasks();
      return true;
    }
    return false;
  }

  deleteAllTasks() {
    this.allTasks = [];
    this.innerTasks = [];
    this.saveMainTasks();
    this.saveInnerTasks();
  }

  saveMainTasks() {
    localStorage.setItem("allTasks", JSON.stringify(this.allTasks));
  }

  saveInnerTasks() {
    localStorage.setItem("innerTasks", JSON.stringify(this.innerTasks));
  }

  getAllTasks() {
    return this.allTasks;
  }

  getInnerTasks(upperTaskText) {
    return this.innerTasks.filter(task => task.upperTaskText === upperTaskText);
  }
}

// Test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    localStorage.clear();
    todoService = new TodoService();
  });

  test('addTask should add a new task', () => {
    const newTask = todoService.addTask('Test Task');
    expect(newTask).toEqual({ text: 'Test Task', check: false });
    expect(todoService.getAllTasks()).toHaveLength(1);
  });

  test('addTask should throw error for duplicate task', () => {
    todoService.addTask('Test Task');
    expect(() => todoService.addTask('Test Task')).toThrow('Task Already Added');
  });

  test('addInnerTask should add a new inner task', () => {
    todoService.addTask('Upper Task');
    const newInnerTask = todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(newInnerTask).toEqual({ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false });
    expect(todoService.getInnerTasks('Upper Task')).toHaveLength(1);
  });

  test('addInnerTask should throw error for duplicate inner task', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(() => todoService.addInnerTask('Upper Task', 'Inner Task')).toThrow('Inner Task Already Added');
  });

  test('toggleTaskCheck should toggle main task check', () => {
    todoService.addTask('Test Task');
    const toggledTask = todoService.toggleTaskCheck('Test Task');
    expect(toggledTask.check).toBe(true);
  });

  test('toggleTaskCheck should toggle inner task check', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    const toggledTask = todoService.toggleTaskCheck('Inner Task', true, 'Upper Task');
    expect(toggledTask.check).toBe(true);
  });

  test('deleteTask should delete a main task and its inner tasks', () => {
    todoService.addTask('Test Task');
    todoService.addInnerTask('Test Task', 'Inner Task');
    const result = todoService.deleteTask('Test Task');
    expect(result).toBe(true);
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks('Test Task')).toHaveLength(0);
  });

  test('deleteInnerTask should delete an inner task', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    const result = todoService.deleteInnerTask('Upper Task', 'Inner Task');
    expect(result).toBe(true);
    expect(todoService.getInnerTasks('Upper Task')).toHaveLength(0);
  });

  test('deleteAllTasks should delete all tasks', () => {
    todoService.addTask('Task 1');
    todoService.addTask('Task 2');
    todoService.addInnerTask('Task 1', 'Inner Task');
    todoService.deleteAllTasks();
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks('Task 1')).toHaveLength(0);
  });

  test('loadTasks should load tasks from localStorage', () => {
    localStorage.setItem('allTasks', JSON.stringify([{ text: 'Loaded Task', check: false }]));
    localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Loaded Task', mainText: 'Loaded Inner Task', check: false }]));
    todoService.loadTasks();
    expect(todoService.getAllTasks()).toHaveLength(1);
    expect(todoService.getInnerTasks('Loaded Task')).toHaveLength(1);
  });
});

// Run the tests
const testResults = [];

function describe(suiteName, testFunction) {
  console.log(`\nTest Suite: ${suiteName}`);
  testFunction();
}

function test(testName, testFunction) {
  try {
    testFunction();
    console.log(`  ✓ ${testName}`);
    testResults.push({ name: testName, passed: true });
  } catch (error) {
    console.error(`  ✗ ${testName}`);
    console.error(`    ${error.message}`);
    testResults.push({ name: testName, passed: false, error: error.message });
  }
}

function expect(actual) {
  return {
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
    toThrow: (expectedError) => {
      try {
        actual();
        throw new Error(`Expected function to throw "${expectedError}", but it did not throw`);
      } catch (error) {
        if (error.message !== expectedError) {
          throw new Error(`Expected function to throw "${expectedError}", but it threw "${error.message}"`);
        }
      }
    },
  };
}

function beforeEach(setupFunction) {
  global.beforeEachFn = setupFunction;
}

// Run the test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    localStorage.clear();
    todoService = new TodoService();
  });

  test('addTask should add a new task', () => {
    const newTask = todoService.addTask('Test Task');
    expect(newTask).toEqual({ text: 'Test Task', check: false });
    expect(todoService.getAllTasks()).toHaveLength(1);
  });

  test('addTask should throw error for duplicate task', () => {
    todoService.addTask('Test Task');
    expect(() => todoService.addTask('Test Task')).toThrow('Task Already Added');
  });

  test('addInnerTask should add a new inner task', () => {
    todoService.addTask('Upper Task');
    const newInnerTask = todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(newInnerTask).toEqual({ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false });
    expect(todoService.getInnerTasks('Upper Task')).toHaveLength(1);
  });

  test('addInnerTask should throw error for duplicate inner task', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(() => todoService.addInnerTask('Upper Task', 'Inner Task')).toThrow('Inner Task Already Added');
  });

  test('toggleTaskCheck should toggle main task check', () => {
    todoService.addTask('Test Task');
    const toggledTask = todoService.toggleTaskCheck('Test Task');
    expect(toggledTask.check).toBe(true);
  });

  test('toggleTaskCheck should toggle inner task check', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    const toggledTask = todoService.toggleTaskCheck('Inner Task', true, 'Upper Task');
    expect(toggledTask.check).toBe(true);
  });

  test('deleteTask should delete a main task and its inner tasks', () => {
    todoService.addTask('Test Task');
    todoService.addInnerTask('Test Task', 'Inner Task');
    const result = todoService.deleteTask('Test Task');
    expect(result).toBe(true);
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks('Test Task')).toHaveLength(0);
  });

  test('deleteInnerTask should delete an inner task', () => {
    todoService.addTask('Upper Task');
    todoService.addInnerTask('Upper Task', 'Inner Task');
    const result = todoService.deleteInnerTask('Upper Task', 'Inner Task');
    expect(result).toBe(true);
    expect(todoService.getInnerTasks('Upper Task')).toHaveLength(0);
  });

  test('deleteAllTasks should delete all tasks', () => {
    todoService.addTask('Task 1');
    todoService.addTask('Task 2');
    todoService.addInnerTask('Task 1', 'Inner Task');
    todoService.deleteAllTasks();
    expect(todoService.getAllTasks()).toHaveLength(0);
    expect(todoService.getInnerTasks('Task 1')).toHaveLength(0);
  });

  test('loadTasks should load tasks from localStorage', () => {
    localStorage.setItem('allTasks', JSON.stringify([{ text: 'Loaded Task', check: false }]));
    localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Loaded Task', mainText: 'Loaded Inner Task', check: false }]));
    todoService.loadTasks();
    expect(todoService.getAllTasks()).toHaveLength(1);
    expect(todoService.getInnerTasks('Loaded Task')).toHaveLength(1);
  });
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
    console.log(`    ${result.error}`);
  });
}