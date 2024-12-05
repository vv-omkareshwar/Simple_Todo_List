// storage.test.js

const Storage = require('../src/scripts/storage');

describe('Storage', () => {
  let storage;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storage = Storage.getInstance();
  });

  test('loadMainTasks should return an empty array when localStorage is empty', () => {
    const tasks = storage.loadMainTasks();
    expect(tasks).toEqual([]);
  });

  test('saveMainTask should save a task to localStorage', () => {
    storage.saveMainTask('Test Task', 0);
    const tasks = storage.loadMainTasks();
    expect(tasks).toEqual([{ text: 'Test Task', check: false }]);
  });

  test('updateTaskCheck should update the check status of a task', () => {
    storage.saveMainTask('Test Task', 0);
    storage.updateTaskCheck('Test Task', true);
    const tasks = storage.loadMainTasks();
    expect(tasks).toEqual([{ text: 'Test Task', check: true }]);
  });

  test('loadInnerTasks should return an empty array when localStorage is empty', () => {
    const innerTasks = storage.loadInnerTasks();
    expect(innerTasks).toEqual([]);
  });

  test('saveInnerTask should save an inner task to localStorage', () => {
    storage.saveInnerTask('Inner Task', 0, 'Upper Task');
    const innerTasks = storage.loadInnerTasks();
    expect(innerTasks).toEqual([{ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: false }]);
  });

  test('updateInnerTaskCheck should update the check status of an inner task', () => {
    storage.saveInnerTask('Inner Task', 0, 'Upper Task');
    storage.updateInnerTaskCheck('Upper Task', 'Inner Task', true);
    const innerTasks = storage.loadInnerTasks();
    expect(innerTasks).toEqual([{ upperTaskText: 'Upper Task', mainText: 'Inner Task', check: true }]);
  });

  test('saveMainTask should update an existing task', () => {
    storage.saveMainTask('Test Task', 0);
    storage.saveMainTask('Updated Task', 0);
    const tasks = storage.loadMainTasks();
    expect(tasks).toEqual([{ text: 'Updated Task', check: false }]);
  });

  test('saveInnerTask should update an existing inner task', () => {
    storage.saveInnerTask('Inner Task', 0, 'Upper Task');
    storage.saveInnerTask('Updated Inner Task', 0, 'Upper Task');
    const innerTasks = storage.loadInnerTasks();
    expect(innerTasks).toEqual([{ upperTaskText: 'Upper Task', mainText: 'Updated Inner Task', check: false }]);
  });

  test('saveMainTask should remove a task when text is empty', () => {
    storage.saveMainTask('Test Task', 0);
    storage.saveMainTask('', 0);
    const tasks = storage.loadMainTasks();
    expect(tasks).toEqual([]);
  });

  test('saveInnerTask should remove an inner task when text is empty', () => {
    storage.saveInnerTask('Inner Task', 0, 'Upper Task');
    storage.saveInnerTask('', 0, 'Upper Task');
    const innerTasks = storage.loadInnerTasks();
    expect(innerTasks).toEqual([]);
  });
});