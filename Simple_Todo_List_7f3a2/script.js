// Existing code remains unchanged
let allTasks = [];
let innerTasks = [];

let count = 1; // for identical collapse id
const upperLi = document.getElementById("upperLi");
const innerLi = document.getElementById("innerLi");
const mainForm = document.getElementById("addingForm");
const mainInput = addingForm.children[0];
const mainList = document.getElementById("mainList");
const delAll = document.getElementById("delAll");

eventListeners();
loadLS();
loadInnerTasks();

// All event listeners
function eventListeners() {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskStufs);
  delAll.addEventListener("click", deleteAll);
}

// Create new task
function createNewTask(text, check) {
  const newLi = upperLi.cloneNode(true);
  newLi.classList.remove("d-none");
  newLi.setAttribute("id", "");
  newLi.children[0].setAttribute("href", `#collapse${count}`);
  newLi.children[0].classList.remove("line-throught");
  newLi.children[0].innerText = text;
  
  if (check === true) {
    newLi.children[0].classList.add("line-throught");
  } else {
    newLi.children[0].classList.remove("line-throught");
  }
  
  newLi.children[3].setAttribute("id", `collapse${count}`);
  mainList.children[0].appendChild(newLi);
  count++;
  mainInput.value = "";
}

// Add new task
function addNewItem(e) {
  e.preventDefault();
  const taskText = mainInput.value.trim();

  if (taskText !== "") {
    allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const taskExists = allTasks.some(item => item.text === taskText);
    
    if (taskExists) {
      alert("Task Already Added");
    } else {
      createNewTask(taskText);
      saveLS(taskText, 1);
    }
  }
}

// Add inner task
function addInnerTask(upperText, mainText, check) {
  let tempLi = innerLi.cloneNode(true);
  tempLi.setAttribute("id", "");

  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      item.classList.remove("d-none");
    }
  });

  tempLi.children[0].innerText = mainText;

  if (check === true) {
    tempLi.children[0].classList.add("line-throught");
  } else {
    tempLi.children[0].classList.remove("line-throught");
  }

  const tempList = Array.from(mainList.children[0].children).find(
    child => child.children[0].innerText === upperText
  );

  if (tempList) {
    tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
      tempLi,
      tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
    );
  }
}

// Handle task operations (delete, check, add inner task)
function taskStufs(e) {
  e.preventDefault();

  if (e.target.classList.contains("delete-item")) {
    handleDeleteItem(e);
  } else if (e.target.classList.contains("delete-inner-item")) {
    handleDeleteInnerItem(e);
  } else if (e.target.classList.contains("check")) {
    handleCheckItem(e);
  } else if (e.target.classList.contains("inner-check")) {
    handleInnerCheckItem(e);
  } else if (e.target.classList.contains("btn-add-inner-task") || e.target.classList.contains("i-add-inner-task")) {
    handleAddInnerTask(e);
  }
}

// Helper functions for taskStufs
function handleDeleteItem(e) {
  const text = e.target.parentElement.children[0].innerText;
  saveLS(text, 0);
  removeInnerTasks(text);
  e.target.parentElement.remove();
}

function handleDeleteInnerItem(e) {
  const upperText = e.target.closest('.collapse').previousElementSibling.innerText;
  saveInnerTasks(e.target.parentElement.children[0].innerText, 0, upperText);
  e.target.parentElement.remove();
}

function handleCheckItem(e) {
  const taskText = e.target.parentElement.children[0].innerText;
  const isChecked = e.target.parentElement.children[0].classList.toggle("line-throught");
  updateTaskStatus(taskText, isChecked);
}

function handleInnerCheckItem(e) {
  const upperText = e.target.closest('.collapse').previousElementSibling.innerText;
  const taskText = e.target.parentElement.children[0].innerText;
  const isChecked = e.target.parentElement.children[0].classList.toggle("line-throught");
  updateInnerTaskStatus(upperText, taskText, isChecked);
}

function handleAddInnerTask(e) {
  const input = e.target.closest('.input-group').querySelector('input');
  const text = input.value.trim();
  const upperText = e.target.closest('.collapse').previousElementSibling.innerText;

  if (text !== "") {
    const taskExists = innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText);
    
    if (taskExists) {
      alert("Task Already Added");
    } else {
      addInnerTask(upperText, text);
      saveInnerTasks({ upperTaskText: upperText, mainText: text, check: false }, 1);
    }
    input.value = "";
  }
}

// Delete all tasks
function deleteAll(e) {
  e.preventDefault();
  const list = mainList.children[0];
  while (list.children.length > 1) {
    list.removeChild(list.lastChild);
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

// Load main tasks from localStorage
function loadLS() {
  allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  allTasks.forEach(item => {
    if (item.text !== "") {
      createNewTask(item.text, item.check);
    }
  });
}

// Load inner tasks from localStorage
function loadInnerTasks() {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks")) || [];
  innerTasks.forEach(item => {
    if (item.mainText !== "") {
      addInnerTask(item.upperTaskText, item.mainText, item.check);
    }
  });
}

// Save main tasks to localStorage
function saveLS(text, index) {
  if (index === -1) {
    localStorage.removeItem("allTasks");
    allTasks = [];
  } else if (index === 0) {
    allTasks = allTasks.filter(item => item.text !== text);
    removeInnerTasks(text);
  } else if (index === 1) {
    allTasks.push({ text, check: false });
  }
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

// Save inner tasks to localStorage
function saveInnerTasks(item, index, upperText = "") {
  if (index === -1) {
    localStorage.removeItem("innerTasks");
    innerTasks = [];
  } else if (index === 0) {
    innerTasks = innerTasks.filter(e => !(e.mainText === item && e.upperTaskText === upperText));
  } else if (index === 1) {
    innerTasks.push(item);
  }
  localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
}

// Helper functions
function removeInnerTasks(upperText) {
  innerTasks = innerTasks.filter(item => item.upperTaskText !== upperText);
  localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
}

function updateTaskStatus(text, isChecked) {
  allTasks = allTasks.map(item => 
    item.text === text ? { ...item, check: isChecked } : item
  );
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function updateInnerTaskStatus(upperText, mainText, isChecked) {
  innerTasks = innerTasks.map(item => 
    item.upperTaskText === upperText && item.mainText === mainText
      ? { ...item, check: isChecked }
      : item
  );
  localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
}