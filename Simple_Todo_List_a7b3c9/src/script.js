// Constants for DOM elements
const UPPER_LI = document.getElementById("upperLi");
const INNER_LI = document.getElementById("innerLi");
const MAIN_FORM = document.getElementById("addingForm");
const MAIN_INPUT = MAIN_FORM.children[0];
const MAIN_LIST = document.getElementById("mainList");
const DELETE_ALL_BUTTON = document.getElementById("delAll");

// State variables
let allTasks = [];
let innerTasks = [];
let collapseIdCounter = 1;

// Initialize the application
function initializeApp() {
  addEventListeners();
  loadTasksFromLocalStorage();
  loadInnerTasksFromLocalStorage();
}

// Add event listeners
function addEventListeners() {
  MAIN_FORM.addEventListener("submit", addNewItem);
  MAIN_LIST.addEventListener("click", handleTaskActions);
  DELETE_ALL_BUTTON.addEventListener("click", deleteAllTasks);
}

// Create a new task element
function createNewTaskElement(text, isChecked = false) {
  const newLi = UPPER_LI.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.removeAttribute("id");

  const taskLink = newLi.children[0];
  taskLink.setAttribute("href", `#collapse${collapseIdCounter}`);
  taskLink.classList.toggle("line-through", isChecked);
  taskLink.innerText = text;

  newLi.children[3].setAttribute("id", `collapse${collapseIdCounter}`);

  MAIN_LIST.children[0].appendChild(newLi);
  collapseIdCounter++;
  MAIN_INPUT.value = "";
}

// Add a new task
function addNewItem(event) {
  event.preventDefault();
  const taskText = MAIN_INPUT.value.trim();

  if (taskText && !isTaskDuplicate(taskText)) {
    createNewTaskElement(taskText);
    saveTaskToLocalStorage(taskText, true);
  }
}

// Check if a task already exists
function isTaskDuplicate(taskText) {
  return allTasks.some(task => task.text === taskText);
}

// Add an inner task
function addInnerTask(upperText, mainText, isChecked = false) {
  const tempLi = INNER_LI.cloneNode(true);
  tempLi.removeAttribute("id");

  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      item.classList.remove("d-none");
    }
  });

  tempLi.children[0].innerText = mainText;
  tempLi.children[0].classList.toggle("line-through", isChecked);

  const parentTask = Array.from(MAIN_LIST.children[0].children)
    .find(item => item.children[0].innerText === upperText);

  if (parentTask) {
    const innerTaskList = parentTask.lastElementChild.firstElementChild.firstElementChild;
    innerTaskList.insertBefore(tempLi, innerTaskList.lastElementChild);
  }
}

// Handle task actions (delete, check, add inner task)
function handleTaskActions(event) {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains("delete-item")) {
    deleteTask(target);
  } else if (target.classList.contains("delete-inner-item")) {
    deleteInnerTask(target);
  } else if (target.classList.contains("check")) {
    toggleTaskCheck(target);
  } else if (target.classList.contains("inner-check")) {
    toggleInnerTaskCheck(target);
  } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
    addNewInnerTask(target);
  }
}

// Delete a task
function deleteTask(target) {
  const taskText = target.parentElement.children[0].innerText;
  removeTaskFromLocalStorage(taskText);
  removeInnerTasksOfParent(taskText);
  target.parentElement.remove();
}

// Delete an inner task
function deleteInnerTask(target) {
  const upperText = target.closest('.collapse').previousElementSibling.innerText;
  const innerText = target.parentElement.children[0].innerText;
  removeInnerTaskFromLocalStorage(innerText, upperText);
  target.parentElement.remove();
}

// Toggle task check state
function toggleTaskCheck(target) {
  const taskElement = target.parentElement.children[0];
  const isChecked = taskElement.classList.toggle("line-through");
  updateTaskCheckStateInLocalStorage(taskElement.innerText, isChecked);
}

// Toggle inner task check state
function toggleInnerTaskCheck(target) {
  const innerTaskElement = target.parentElement.children[0];
  const upperText = target.closest('.collapse').previousElementSibling.innerText;
  const isChecked = innerTaskElement.classList.toggle("line-through");
  updateInnerTaskCheckStateInLocalStorage(innerTaskElement.innerText, upperText, isChecked);
}

// Add a new inner task
function addNewInnerTask(target) {
  const inputElement = target.closest('.input-group').querySelector('input');
  const text = inputElement.value.trim();
  const upperText = target.closest('.collapse').previousElementSibling.innerText;

  if (text && !isInnerTaskDuplicate(text, upperText)) {
    addInnerTask(upperText, text);
    saveInnerTaskToLocalStorage({ upperTaskText: upperText, mainText: text, check: false }, true);
    inputElement.value = "";
  }
}

// Check if an inner task already exists
function isInnerTaskDuplicate(text, upperText) {
  return innerTasks.some(task => task.mainText === text && task.upperTaskText === upperText);
}

// Delete all tasks
function deleteAllTasks(event) {
  event.preventDefault();
  const taskList = MAIN_LIST.children[0];
  while (taskList.children.length > 1) {
    taskList.removeChild(taskList.lastChild);
  }
  clearLocalStorage();
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  allTasks.forEach(item => {
    if (item.text) {
      createNewTaskElement(item.text, item.check);
    }
  });
}

// Load inner tasks from local storage
function loadInnerTasksFromLocalStorage() {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  innerTasks.forEach(item => {
    if (item.mainText) {
      addInnerTask(item.upperTaskText, item.mainText, item.check);
    }
  });
}

// Save task to local storage
function saveTaskToLocalStorage(text, shouldAdd) {
  const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  if (shouldAdd) {
    tasks.push({ text, check: false });
  } else {
    const index = tasks.findIndex(task => task.text === text);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  }
  localStorage.setItem("allTasks", JSON.stringify(tasks));
}

// Save inner task to local storage
function saveInnerTaskToLocalStorage(item, shouldAdd) {
  const tasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  if (shouldAdd) {
    tasks.push(item);
  } else {
    const index = tasks.findIndex(task => task.mainText === item.mainText && task.upperTaskText === item.upperTaskText);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  }
  localStorage.setItem("innerTasks", JSON.stringify(tasks));
}

// Remove task from local storage
function removeTaskFromLocalStorage(text) {
  saveTaskToLocalStorage(text, false);
}

// Remove inner task from local storage
function removeInnerTaskFromLocalStorage(text, upperText) {
  saveInnerTaskToLocalStorage({ mainText: text, upperTaskText: upperText }, false);
}

// Remove inner tasks of a parent task
function removeInnerTasksOfParent(upperText) {
  const tasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const updatedTasks = tasks.filter(task => task.upperTaskText !== upperText);
  localStorage.setItem("innerTasks", JSON.stringify(updatedTasks));
}

// Update task check state in local storage
function updateTaskCheckStateInLocalStorage(text, isChecked) {
  const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  const task = tasks.find(task => task.text === text);
  if (task) {
    task.check = isChecked;
    localStorage.setItem("allTasks", JSON.stringify(tasks));
  }
}

// Update inner task check state in local storage
function updateInnerTaskCheckStateInLocalStorage(text, upperText, isChecked) {
  const tasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const task = tasks.find(task => task.mainText === text && task.upperTaskText === upperText);
  if (task) {
    task.check = isChecked;
    localStorage.setItem("innerTasks", JSON.stringify(tasks));
  }
}

// Clear local storage
function clearLocalStorage() {
  localStorage.removeItem("allTasks");
  localStorage.removeItem("innerTasks");
  allTasks = [];
  innerTasks = [];
}

// Initialize the application
initializeApp();