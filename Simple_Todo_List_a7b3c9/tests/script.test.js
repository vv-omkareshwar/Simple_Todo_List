// Mock DOM implementation
const mockDOM = {
  upperLi: {
    cloneNode: () => ({
      classList: { remove: jest.fn(), toggle: jest.fn() },
      removeAttribute: jest.fn(),
      children: [
        { setAttribute: jest.fn(), classList: { toggle: jest.fn() }, innerText: '' },
        {}, {}, { setAttribute: jest.fn() }
      ]
    })
  },
  innerLi: {
    cloneNode: () => ({
      removeAttribute: jest.fn(),
      childNodes: [
        {}, {}, {}, { classList: { remove: jest.fn() } },
        {}, { classList: { remove: jest.fn() } }
      ],
      children: [{ innerText: '', classList: { toggle: jest.fn() } }]
    })
  },
  mainForm: { addEventListener: jest.fn(), children: [{ value: '' }] },
  mainInput: { value: '' },
  mainList: {
    addEventListener: jest.fn(),
    children: [{ appendChild: jest.fn(), children: [] }]
  },
  delAll: { addEventListener: jest.fn() }
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

// Mock document object
global.document = {
  getElementById: (id) => mockDOM[id] || { addEventListener: jest.fn() }
};

// Mock window object
global.window = {
  localStorage: mockLocalStorage
};

// Implementation code
const UPPER_LI = document.getElementById("upperLi");
const INNER_LI = document.getElementById("innerLi");
const MAIN_FORM = document.getElementById("addingForm");
const MAIN_INPUT = MAIN_FORM.children[0];
const MAIN_LIST = document.getElementById("mainList");
const DELETE_ALL_BUTTON = document.getElementById("delAll");

let allTasks = [];
let innerTasks = [];
let collapseIdCounter = 1;

function initializeApp() {
  addEventListeners();
  loadTasksFromLocalStorage();
  loadInnerTasksFromLocalStorage();
}

function addEventListeners() {
  MAIN_FORM.addEventListener("submit", addNewItem);
  MAIN_LIST.addEventListener("click", handleTaskActions);
  DELETE_ALL_BUTTON.addEventListener("click", deleteAllTasks);
}

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

function addNewItem(event) {
  event.preventDefault();
  const taskText = MAIN_INPUT.value.trim();

  if (taskText && !isTaskDuplicate(taskText)) {
    createNewTaskElement(taskText);
    saveTaskToLocalStorage(taskText, true);
  }
}

function isTaskDuplicate(taskText) {
  return allTasks.some(task => task.text === taskText);
}

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

function deleteTask(target) {
  const taskText = target.parentElement.children[0].innerText;
  removeTaskFromLocalStorage(taskText);
  removeInnerTasksOfParent(taskText);
  target.parentElement.remove();
}

function deleteInnerTask(target) {
  const upperText = target.closest('.collapse').previousElementSibling.innerText;
  const innerText = target.parentElement.children[0].innerText;
  removeInnerTaskFromLocalStorage(innerText, upperText);
  target.parentElement.remove();
}

function toggleTaskCheck(target) {
  const taskElement = target.parentElement.children[0];
  const isChecked = taskElement.classList.toggle("line-through");
  updateTaskCheckStateInLocalStorage(taskElement.innerText, isChecked);
}

function toggleInnerTaskCheck(target) {
  const innerTaskElement = target.parentElement.children[0];
  const upperText = target.closest('.collapse').previousElementSibling.innerText;
  const isChecked = innerTaskElement.classList.toggle("line-through");
  updateInnerTaskCheckStateInLocalStorage(innerTaskElement.innerText, upperText, isChecked);
}

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

function isInnerTaskDuplicate(text, upperText) {
  return innerTasks.some(task => task.mainText === text && task.upperTaskText === upperText);
}

function deleteAllTasks(event) {
  event.preventDefault();
  const taskList = MAIN_LIST.children[0];
  while (taskList.children.length > 1) {
    taskList.removeChild(taskList.lastChild);
  }
  clearLocalStorage();
}

function loadTasksFromLocalStorage() {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  allTasks.forEach(item => {
    if (item.text) {
      createNewTaskElement(item.text, item.check);
    }
  });
}

function loadInnerTasksFromLocalStorage() {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  innerTasks.forEach(item => {
    if (item.mainText) {
      addInnerTask(item.upperTaskText, item.mainText, item.check);
    }
  });
}

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

function removeTaskFromLocalStorage(text) {
  saveTaskToLocalStorage(text, false);
}

function removeInnerTaskFromLocalStorage(text, upperText) {
  saveInnerTaskToLocalStorage({ mainText: text, upperTaskText: upperText }, false);
}

function removeInnerTasksOfParent(upperText) {
  const tasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const updatedTasks = tasks.filter(task => task.upperTaskText !== upperText);
  localStorage.setItem("innerTasks", JSON.stringify(updatedTasks));
}

function updateTaskCheckStateInLocalStorage(text, isChecked) {
  const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  const task = tasks.find(task => task.text === text);
  if (task) {
    task.check = isChecked;
    localStorage.setItem("allTasks", JSON.stringify(tasks));
  }
}

function updateInnerTaskCheckStateInLocalStorage(text, upperText, isChecked) {
  const tasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  const task = tasks.find(task => task.mainText === text && task.upperTaskText === upperText);
  if (task) {
    task.check = isChecked;
    localStorage.setItem("innerTasks", JSON.stringify(tasks));
  }
}

function clearLocalStorage() {
  localStorage.removeItem("allTasks");
  localStorage.removeItem("innerTasks");
  allTasks = [];
  innerTasks = [];
}

// Test suite
describe('Todo App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    allTasks = [];
    innerTasks = [];
    collapseIdCounter = 1;
  });

  test('initializeApp sets up event listeners and loads tasks', () => {
    initializeApp();
    expect(MAIN_FORM.addEventListener).toHaveBeenCalledWith('submit', addNewItem);
    expect(MAIN_LIST.addEventListener).toHaveBeenCalledWith('click', handleTaskActions);
    expect(DELETE_ALL_BUTTON.addEventListener).toHaveBeenCalledWith('click', deleteAllTasks);
    expect(localStorage.getItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.getItem).toHaveBeenCalledWith('innerTasks');
  });

  test('createNewTaskElement adds a new task', () => {
    createNewTaskElement('Test Task');
    expect(UPPER_LI.cloneNode().classList.remove).toHaveBeenCalledWith('d-none');
    expect(UPPER_LI.cloneNode().removeAttribute).toHaveBeenCalledWith('id');
    expect(MAIN_LIST.children[0].appendChild).toHaveBeenCalled();
    expect(collapseIdCounter).toBe(2);
    expect(MAIN_INPUT.value).toBe('');
  });

  test('addNewItem adds a new task and saves to localStorage', () => {
    const mockEvent = { preventDefault: jest.fn() };
    MAIN_INPUT.value = 'New Task';
    localStorage.getItem.mockReturnValue('[]');

    addNewItem(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('allTasks', JSON.stringify([{ text: 'New Task', check: false }]));
  });

  test('deleteAllTasks removes all tasks', () => {
    const mockEvent = { 
      preventDefault: jest.fn(),
      target: { 
        closest: jest.fn().mockReturnValue({ 
          querySelector: jest.fn().mockReturnValue({ children: [{ children: [1, 2, 3] }] }) 
        }) 
      }
    };

    deleteAllTasks(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('allTasks');
    expect(localStorage.removeItem).toHaveBeenCalledWith('innerTasks');
  });

  // Add more tests for other functions as needed
});

// Run the tests
require('jest').run();