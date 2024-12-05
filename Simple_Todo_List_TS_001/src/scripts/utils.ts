// utils.ts

import { Task, InnerTask } from './types';

let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];

let count = 1; // for identical collapse id
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

export function initializeApp(): void {
  eventListeners();
  loadLS();
  loadInnerTasks();
}

// all Listeners
function eventListeners(): void {
  // submit event
  mainForm.addEventListener("submit", addNewItem);

  // task stufs
  mainList.addEventListener("click", taskStufs);

  // delete all tasks
  delAll.addEventListener("click", deleteAll);
}

// to create new task
function createNewTask(text: string, check: boolean): void {
  // to clone upper visible li in html page
  const newLi = upperLi.cloneNode(true) as HTMLLIElement;
  // making visible the new li
  newLi.classList.remove("d-none");
  // removing id
  newLi.setAttribute("id", "");

  const anchor = newLi.children[0] as HTMLAnchorElement;
  anchor.setAttribute("href", `#collapse${count}`); // identical colapseId

  anchor.classList.remove("line-throught");

  anchor.innerText = text;
  if (check) {
    anchor.classList.add("line-throught");
  } else {
    anchor.classList.remove("line-throught");
  }
  newLi.children[3].setAttribute("id", `collapse${count}`);

  mainList.children[0].appendChild(newLi);

  count++; // for different value of collapseId
  mainInput.value = "";
}

// add New Task
function addNewItem(e: Event): void {
  e.preventDefault();
  // entered text
  const taskText = mainInput.value;

  if (taskText !== "") {
    allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
    let c = false;
    allTasks.forEach((item) => {
      if (item.text === taskText) {
        c = true;
        alert("Task Already Added");
      }
    });
    if (!c) {
      createNewTask(taskText, false);
      saveLS(taskText, 1);
    }
  }
}

// to add Inner Tasks
function addInnerTask(upperText: string, mainText: string, check: boolean): void {
  // to clone inner visible li from html page
  let tempLi = innerLi.cloneNode(true) as HTMLLIElement;
  tempLi.setAttribute("id", "");

  // making visible check and delete icons.
  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      (item as HTMLElement).classList.remove("d-none");
    }
  });
  // to add the value to new li text
  (tempLi.children[0] as HTMLElement).innerText = mainText;

  // check
  if (check) {
    tempLi.children[0].classList.add("line-throught");
  } else {
    tempLi.children[0].classList.remove("line-throught");
  }

  // adding new inner task to last of the list before form
  let tempList: HTMLElement | null = null;
  for (let i = 1; i < mainList.children[0].children.length; i++) {
    if (upperText === (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
      tempList = mainList.children[0].children[i] as HTMLElement;
      break;
    }
  }

  // adding inner to upper
  if (tempList) {
    const innerList = tempList.lastElementChild?.firstElementChild?.firstElementChild as HTMLElement;
    innerList.insertBefore(tempLi, innerList.lastElementChild);
  }
}

// delete and check a task - add new inner task
function taskStufs(e: Event): void {
  e.preventDefault();
  const target = e.target as HTMLElement;

  if (target.classList.contains("delete-item")) {
    deleteItem(target);
  } else if (target.classList.contains("delete-inner-item")) {
    deleteInnerItem(target);
  } else if (target.classList.contains("check")) {
    toggleCheck(target);
  } else if (target.classList.contains("inner-check")) {
    toggleInnerCheck(target);
  } else if (target.classList.contains("btn-add-inner-task")) {
    addNewInnerTask(target);
  } else if (target.classList.contains("i-add-inner-task")) {
    addNewInnerTaskWithIcon(target);
  }
}

// Helper functions for taskStufs
function deleteItem(target: HTMLElement): void {
  const text = (target.parentElement?.children[0] as HTMLElement).innerText;
  saveLS(text, 0);

  let tempInnerList: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

  tempInnerList.forEach((item) => {
    if (text === item.upperTaskText) {
      saveInnerTasks(item.mainText, 0, text);
    }
  });

  target.parentElement?.remove();
}

function deleteInnerItem(target: HTMLElement): void {
  const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
  saveInnerTasks((target.parentElement?.children[0] as HTMLElement).innerText, 0, upperText);
  target.parentElement?.remove();
}

function toggleCheck(target: HTMLElement): void {
  let tmpList: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
  const taskText = (target.parentElement?.children[0] as HTMLElement).innerText;

  const task = tmpList.find(item => item.text === taskText);
  if (task) {
    task.check = !task.check;
    localStorage.setItem("allTasks", JSON.stringify(tmpList));
    target.parentElement?.children[0].classList.toggle("line-throught");
  }
}

function toggleInnerCheck(target: HTMLElement): void {
  let tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
  const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
  const taskText = (target.parentElement?.children[0] as HTMLElement).innerText;

  const task = tmp.find(item => item.mainText === taskText && item.upperTaskText === upperText);
  if (task) {
    task.check = !task.check;
    localStorage.setItem("innerTasks", JSON.stringify(tmp));
    target.parentElement?.children[0].classList.toggle("line-throught");
  }
}

function addNewInnerTask(target: HTMLElement): void {
  const text = (target.parentElement?.childNodes[1] as HTMLInputElement).value;
  if (text !== "") {
    const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
    addInnerTaskIfNotExists(text, upperText);
  }
  (target.parentElement?.childNodes[1] as HTMLInputElement).value = "";
}

function addNewInnerTaskWithIcon(target: HTMLElement): void {
  const text = (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value;
  if (text !== "") {
    const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
    addInnerTaskIfNotExists(text, upperText);
  }
  (target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement).value = "";
}

function addInnerTaskIfNotExists(text: string, upperText: string): void {
  innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");
  const exists = innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText);
  if (!exists) {
    const newInnerTask: InnerTask = { upperTaskText: upperText, mainText: text, check: false };
    innerTasks.push(newInnerTask);
    addInnerTask(upperText, text, false);
    saveInnerTasks(newInnerTask, 1);
  } else {
    alert("Task Already Added");
  }
}

// delete all
function deleteAll(e: Event): void {
  e.preventDefault();
  const list = (e.target as HTMLElement).parentElement?.parentElement?.children[1].children[0].childNodes[1].children;
  if (list) {
    while (list.length !== 1) {
      // block the remove main invisible li in html
      list[list.length - 1].remove();
    }
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

// loading Main Tasks
function loadLS(): void {
  if (localStorage.getItem("allTasks") === null) {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  } else {
    allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");

    allTasks.forEach((item) => {
      if (item.text !== "") {
        createNewTask(item.text, item.check);
      }
    });
  }
}

// loading Inner Tasks
function loadInnerTasks(): void {
  if (localStorage.getItem("innerTasks") === null) {
    localStorage.setItem("innerTasks", JSON.stringify(innerTasks));
  } else {
    innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");

    innerTasks.forEach((item) => {
      if (item.mainText !== "") {
        addInnerTask(item.upperTaskText, item.mainText, item.check);
      }
    });
  }
}

// saving Main Tasks
function saveLS(text: string, index: number): void {
  // if index = 1 add, = 0 remove, =-1 remove all
  if (index === -1) {
    localStorage.removeItem("allTasks");
    allTasks = [];
    loadLS();
  } else if (index === 0) {
    const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
    const taskIndex = tmp.findIndex(item => item.text === text);
    if (taskIndex !== -1) {
      tmp.splice(taskIndex, 1);
      localStorage.setItem("allTasks", JSON.stringify(tmp));

      // delete inner tasks whose upper text that
      const tmp2: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
      tmp2.filter(item => item.upperTaskText === text).forEach(item => {
        saveInnerTasks(item.mainText, 0, text);
      });
    }
  } else if (index === 1) {
    const tmp: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
    tmp.push({ text: text, check: false });
    localStorage.setItem("allTasks", JSON.stringify(tmp));
  }
}

// saving Inner Tasks
function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ""): void {
  // if index = 1 add, = 0 remove, =-1 remove all
  if (index === -1) {
    localStorage.removeItem("innerTasks");
    innerTasks = [];
    loadInnerTasks();
  } else if (index === 0) {
    const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    const taskIndex = tmp.findIndex(e => e.mainText === item && e.upperTaskText === upperText);
    if (taskIndex !== -1) {
      tmp.splice(taskIndex, 1);
      localStorage.setItem("innerTasks", JSON.stringify(tmp));
    }
  } else if (index === 1) {
    const tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");
    tmp.push(item as InnerTask);
    localStorage.setItem("innerTasks", JSON.stringify(tmp));
  }
}

export { createNewTask, addInnerTask, saveLS, saveInnerTasks };