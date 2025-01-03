// Mock implementation of localStorage
const mockLocalStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

// Replace global localStorage with mock
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// TodoService implementation
class TodoService {
  constructor() {
    this.allTasks = [];
    this.innerTasks = [];
    this.count = 1;
  }

  loadFromLocalStorage() {
    this.allTasks = JSON.parse(localStorage.getItem('allTasks')) || [];
    this.innerTasks = JSON.parse(localStorage.getItem('innerTasks')) || [];
  }

  saveToLocalStorage() {
    localStorage.setItem('allTasks', JSON.stringify(this.allTasks));
    localStorage.setItem('innerTasks', JSON.stringify(this.innerTasks));
  }

  addTask(taskText) {
    if (taskText && !this.allTasks.some(task => task.text === taskText)) {
      this.allTasks.push({ text: taskText, check: false });
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  removeTask(taskText) {
    const index = this.allTasks.findIndex(task => task.text === taskText);
    if (index !== -1) {
      this.allTasks.splice(index, 1);
      this.innerTasks = this.innerTasks.filter(task => task.upperTaskText !== taskText);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  toggleTaskCheck(taskText) {
    const task = this.allTasks.find(task => task.text === taskText);
    if (task) {
      task.check = !task.check;
      this.saveToLocalStorage();
      return task.check;
    }
    return null;
  }

  addInnerTask(upperText, mainText) {
    if (mainText && !this.innerTasks.some(task => task.upperTaskText === upperText && task.mainText === mainText)) {
      this.innerTasks.push({ upperTaskText: upperText, mainText: mainText, check: false });
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  removeInnerTask(upperText, mainText) {
    const index = this.innerTasks.findIndex(task => task.upperTaskText === upperText && task.mainText === mainText);
    if (index !== -1) {
      this.innerTasks.splice(index, 1);
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  toggleInnerTaskCheck(upperText, mainText) {
    const task = this.innerTasks.find(task => task.upperTaskText === upperText && task.mainText === mainText);
    if (task) {
      task.check = !task.check;
      this.saveToLocalStorage();
      return task.check;
    }
    return null;
  }

  deleteAllTasks() {
    this.allTasks = [];
    this.innerTasks = [];
    this.saveToLocalStorage();
  }

  getNextCollapseId() {
    return `collapse${this.count++}`;
  }
}

// Test suite
describe('TodoService', () => {
  let todoService;

  beforeEach(() => {
    localStorage.clear();
    todoService = new TodoService();
  });

  test('loadFromLocalStorage loads tasks from localStorage', () => {
    localStorage.setItem('allTasks', JSON.stringify([{ text: 'Task 1', check: false }]));
    localStorage.setItem('innerTasks', JSON.stringify([{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }]));
    
    todoService.loadFromLocalStorage();
    
    expect(todoService.allTasks).toEqual([{ text: 'Task 1', check: false }]);
    expect(todoService.innerTasks).toEqual([{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }]);
  });

  test('saveToLocalStorage saves tasks to localStorage', () => {
    todoService.allTasks = [{ text: 'Task 1', check: false }];
    todoService.innerTasks = [{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }];
    
    todoService.saveToLocalStorage();
    
    expect(JSON.parse(localStorage.getItem('allTasks'))).toEqual([{ text: 'Task 1', check: false }]);
    expect(JSON.parse(localStorage.getItem('innerTasks'))).toEqual([{ upperTaskText: 'Task 1', mainText: 'Inner Task 1', check: false }]);
  });

  test('addTask adds a new task', () => {
    expect(todoService.addTask('New Task')).toBe(true);
    expect(todoService.allTasks).toEqual([{ text: 'New Task', check: false }]);
  });

  test('addTask does not add duplicate task', () => {
    todoService.addTask('Task 1');
    expect(todoService.addTask('Task 1')).toBe(false);
    expect(todoService.allTasks).toHaveLength(1);
  });

  test('removeTask removes an existing task', () => {
    todoService.addTask('Task 1');
    expect(todoService.removeTask('Task 1')).toBe(true);
    expect(todoService.allTasks).toHaveLength(0);
  });

  test('removeTask returns false for non-existent task', () => {
    expect(todoService.removeTask('Non-existent Task')).toBe(false);
  });

  test('toggleTaskCheck toggles task check status', () => {
    todoService.addTask('Task 1');
    expect(todoService.toggleTaskCheck('Task 1')).toBe(true);
    expect(todoService.allTasks[0].check).toBe(true);
    expect(todoService.toggleTaskCheck('Task 1')).toBe(false);
    expect(todoService.allTasks[0].check).toBe(false);
  });

  test('addInnerTask adds a new inner task', () => {
    expect(todoService.addInnerTask('Upper Task', 'Inner Task')).toBe(true);
    expect(todoService.innerTasks).toEqual([{ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false }]);
  });

  test('addInnerTask does not add duplicate inner task', () => {
    todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(todoService.addInnerTask('Upper Task', 'Inner Task')).toBe(false);
    expect(todoService.innerTasks).toHaveLength(1);
  });

  test('removeInnerTask removes an existing inner task', () => {
    todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(todoService.removeInnerTask('Upper Task', 'Inner Task')).toBe(true);
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('toggleInnerTaskCheck toggles inner task check status', () => {
    todoService.addInnerTask('Upper Task', 'Inner Task');
    expect(todoService.toggleInnerTaskCheck('Upper Task', 'Inner Task')).toBe(true);
    expect(todoService.innerTasks[0].check).toBe(true);
    expect(todoService.toggleInnerTaskCheck('Upper Task', 'Inner Task')).toBe(false);
    expect(todoService.innerTasks[0].check).toBe(false);
  });

  test('deleteAllTasks removes all tasks and inner tasks', () => {
    todoService.addTask('Task 1');
    todoService.addTask('Task 2');
    todoService.addInnerTask('Task 1', 'Inner Task 1');
    todoService.addInnerTask('Task 2', 'Inner Task 2');
    todoService.deleteAllTasks();
    expect(todoService.allTasks).toHaveLength(0);
    expect(todoService.innerTasks).toHaveLength(0);
  });

  test('getNextCollapseId returns unique collapse IDs', () => {
    expect(todoService.getNextCollapseId()).toBe('collapse1');
    expect(todoService.getNextCollapseId()).toBe('collapse2');
    expect(todoService.getNextCollapseId()).toBe('collapse3');
  });
});

// Run the tests
describe('TodoService Tests', () => {
  // All test cases are defined above
});