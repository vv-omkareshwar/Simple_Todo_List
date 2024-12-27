import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  loadTasks,
  saveTasks,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  addInnerTask,
  deleteInnerTask,
  toggleInnerTaskCompletion,
  deleteAllTasks
} from '../src/utils/localStorage';

describe('localStorage utility functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should load tasks from localStorage', () => {
    const tasks = [{ id: 1, text: 'Test Task', completed: false }];
    localStorage.setItem('tasks', JSON.stringify(tasks));
    expect(loadTasks()).toEqual(tasks);
  });

  it('should save tasks to localStorage', () => {
    const tasks = [{ id: 1, text: 'Test Task', completed: false }];
    saveTasks(tasks);
    expect(JSON.parse(localStorage.getItem('tasks'))).toEqual(tasks);
  });

  it('should add a new task', () => {
    const newTask = { id: 1, text: 'New Task', completed: false };
    addTask(newTask);
    expect(loadTasks()).toContainEqual(newTask);
  });

  it('should delete a task', () => {
    const task = { id: 1, text: 'Test Task', completed: false };
    saveTasks([task]);
    deleteTask(1);
    expect(loadTasks()).not.toContainEqual(task);
  });

  it('should toggle task completion', () => {
    const task = { id: 1, text: 'Test Task', completed: false };
    saveTasks([task]);
    toggleTaskCompletion(1);
    expect(loadTasks()[0].completed).toBe(true);
  });

  it('should add an inner task', () => {
    const task = { id: 1, text: 'Main Task', completed: false, innerTasks: [] };
    saveTasks([task]);
    const innerTask = { id: 2, text: 'Inner Task', completed: false };
    addInnerTask(1, innerTask);
    expect(loadTasks()[0].innerTasks).toContainEqual(innerTask);
  });

  it('should delete an inner task', () => {
    const task = {
      id: 1,
      text: 'Main Task',
      completed: false,
      innerTasks: [{ id: 2, text: 'Inner Task', completed: false }]
    };
    saveTasks([task]);
    deleteInnerTask(1, 2);
    expect(loadTasks()[0].innerTasks).toHaveLength(0);
  });

  it('should toggle inner task completion', () => {
    const task = {
      id: 1,
      text: 'Main Task',
      completed: false,
      innerTasks: [{ id: 2, text: 'Inner Task', completed: false }]
    };
    saveTasks([task]);
    toggleInnerTaskCompletion(1, 2);
    expect(loadTasks()[0].innerTasks[0].completed).toBe(true);
  });

  it('should delete all tasks', () => {
    const tasks = [
      { id: 1, text: 'Task 1', completed: false },
      { id: 2, text: 'Task 2', completed: true }
    ];
    saveTasks(tasks);
    deleteAllTasks();
    expect(loadTasks()).toHaveLength(0);
  });
});