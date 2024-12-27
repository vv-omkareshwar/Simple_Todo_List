// src/utils/localStorage.js

// Function to load tasks from localStorage
export const loadTasks = () => {
  const storedTasks = localStorage.getItem('allTasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Function to save tasks to localStorage
export const saveTasks = (tasks) => {
  localStorage.setItem('allTasks', JSON.stringify(tasks));
};

// Function to load inner tasks from localStorage
export const loadInnerTasks = () => {
  const storedInnerTasks = localStorage.getItem('innerTasks');
  return storedInnerTasks ? JSON.parse(storedInnerTasks) : [];
};

// Function to save inner tasks to localStorage
export const saveInnerTasks = (innerTasks) => {
  localStorage.setItem('innerTasks', JSON.stringify(innerTasks));
};

// Function to add a new task
export const addTask = (text) => {
  const tasks = loadTasks();
  const newTask = { text, check: false };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

// Function to delete a task
export const deleteTask = (text) => {
  const tasks = loadTasks();
  const updatedTasks = tasks.filter(task => task.text !== text);
  saveTasks(updatedTasks);
  
  // Remove inner tasks associated with the deleted task
  const innerTasks = loadInnerTasks();
  const updatedInnerTasks = innerTasks.filter(innerTask => innerTask.upperTaskText !== text);
  saveInnerTasks(updatedInnerTasks);
};

// Function to toggle task completion
export const toggleTaskCompletion = (text) => {
  const tasks = loadTasks();
  const updatedTasks = tasks.map(task => 
    task.text === text ? { ...task, check: !task.check } : task
  );
  saveTasks(updatedTasks);
};

// Function to add an inner task
export const addInnerTask = (upperText, mainText) => {
  const innerTasks = loadInnerTasks();
  const newInnerTask = { upperTaskText: upperText, mainText, check: false };
  innerTasks.push(newInnerTask);
  saveInnerTasks(innerTasks);
  return newInnerTask;
};

// Function to delete an inner task
export const deleteInnerTask = (upperText, mainText) => {
  const innerTasks = loadInnerTasks();
  const updatedInnerTasks = innerTasks.filter(
    task => !(task.upperTaskText === upperText && task.mainText === mainText)
  );
  saveInnerTasks(updatedInnerTasks);
};

// Function to toggle inner task completion
export const toggleInnerTaskCompletion = (upperText, mainText) => {
  const innerTasks = loadInnerTasks();
  const updatedInnerTasks = innerTasks.map(task => 
    (task.upperTaskText === upperText && task.mainText === mainText)
      ? { ...task, check: !task.check }
      : task
  );
  saveInnerTasks(updatedInnerTasks);
};

// Function to delete all tasks and inner tasks
export const deleteAllTasks = () => {
  localStorage.removeItem('allTasks');
  localStorage.removeItem('innerTasks');
};