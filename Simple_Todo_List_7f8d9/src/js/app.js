// app.js

import { TaskManager } from './taskManager.js';
import { Storage } from './storage.js';

class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.storage = new Storage();
    this.count = 1; // for identical collapse id
    this.upperLi = document.getElementById("upperLi");
    this.innerLi = document.getElementById("innerLi");
    this.mainForm = document.getElementById("addingForm");
    this.mainInput = this.mainForm.children[0];
    this.mainList = document.getElementById("mainList");
    this.delAll = document.getElementById("delAll");

    this.init();
  }

  init() {
    this.eventListeners();
    this.loadTasks();
  }

  eventListeners() {
    this.mainForm.addEventListener("submit", this.addNewItem.bind(this));
    this.mainList.addEventListener("click", this.taskStuff.bind(this));
    this.delAll.addEventListener("click", this.deleteAll.bind(this));
  }

  createNewTask(text, check = false) {
    const newLi = this.upperLi.cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.removeAttribute("id");

    newLi.children[0].setAttribute("href", `#collapse${this.count}`);
    newLi.children[0].classList.toggle("line-through", check);
    newLi.children[0].innerText = text;
    newLi.children[3].setAttribute("id", `collapse${this.count}`);

    this.mainList.children[0].appendChild(newLi);

    this.count++;
    this.mainInput.value = "";
  }

  addNewItem(e) {
    e.preventDefault();
    const taskText = this.mainInput.value.trim();

    if (taskText !== "") {
      if (!this.taskManager.taskExists(taskText)) {
        this.createNewTask(taskText);
        this.storage.saveTask(taskText, false);
      } else {
        alert("Task Already Added");
      }
    }
  }

  addInnerTask(upperText, mainText, check = false) {
    const tempLi = this.innerLi.cloneNode(true);
    tempLi.removeAttribute("id");

    tempLi.childNodes.forEach((item, index) => {
      if (index === 3 || index === 5) {
        item.classList.remove("d-none");
      }
    });

    tempLi.children[0].innerText = mainText;
    tempLi.children[0].classList.toggle("line-through", check);

    const parentList = Array.from(this.mainList.children[0].children)
      .find(item => item.children[0].innerText === upperText);

    if (parentList) {
      const insertionPoint = parentList.lastElementChild.firstElementChild.firstElementChild;
      insertionPoint.insertBefore(tempLi, insertionPoint.lastElementChild);
    }
  }

  taskStuff(e) {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains("delete-item")) {
      this.deleteTask(target);
    } else if (target.classList.contains("delete-inner-item")) {
      this.deleteInnerTask(target);
    } else if (target.classList.contains("check")) {
      this.toggleTaskCheck(target);
    } else if (target.classList.contains("inner-check")) {
      this.toggleInnerTaskCheck(target);
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
      this.addNewInnerTask(target);
    }
  }

  deleteTask(target) {
    const text = target.parentElement.children[0].innerText;
    this.storage.removeTask(text);
    this.storage.removeInnerTasksByUpperTask(text);
    target.parentElement.remove();
  }

  deleteInnerTask(target) {
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    const innerText = target.parentElement.children[0].innerText;
    this.storage.removeInnerTask(innerText, upperText);
    target.parentElement.remove();
  }

  toggleTaskCheck(target) {
    const taskText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    this.storage.updateTaskCheck(taskText, isChecked);
  }

  toggleInnerTaskCheck(target) {
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;
    const innerText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-through");
    this.storage.updateInnerTaskCheck(innerText, upperText, isChecked);
  }

  addNewInnerTask(target) {
    const inputElement = target.closest('.input-group').querySelector('input');
    const text = inputElement.value.trim();
    const upperText = target.closest('.collapse').parentElement.children[0].innerText;

    if (text !== "") {
      if (!this.storage.innerTaskExists(text, upperText)) {
        this.addInnerTask(upperText, text);
        this.storage.saveInnerTask(upperText, text, false);
        inputElement.value = "";
      } else {
        alert("Task Already Added");
      }
    }
  }

  deleteAll(e) {
    e.preventDefault();
    const list = this.mainList.children[0].children;
    while (list.length > 1) {
      list[list.length - 1].remove();
    }
    this.storage.clearAllTasks();
    this.count = 1;
  }

  loadTasks() {
    const allTasks = this.storage.getAllTasks();
    allTasks.forEach(task => {
      this.createNewTask(task.text, task.check);
    });

    const innerTasks = this.storage.getAllInnerTasks();
    innerTasks.forEach(task => {
      this.addInnerTask(task.upperTaskText, task.mainText, task.check);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});

export { App };