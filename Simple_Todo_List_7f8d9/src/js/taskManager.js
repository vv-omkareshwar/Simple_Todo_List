// taskManager.js

import { saveLS, saveInnerTasks, loadLS, loadInnerTasks } from './storage.js';

class TaskManager {
  constructor() {
    this.allTasks = [];
    this.innerTasks = [];
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
    loadLS();
    loadInnerTasks();
  }

  eventListeners() {
    this.mainForm.addEventListener("submit", this.addNewItem.bind(this));
    this.mainList.addEventListener("click", this.taskStufs.bind(this));
    this.delAll.addEventListener("click", this.deleteAll.bind(this));
  }

  createNewTask(text, check = false) {
    const newLi = this.upperLi.cloneNode(true);
    newLi.classList.remove("d-none");
    newLi.setAttribute("id", "");

    newLi.children[0].setAttribute("href", `#collapse${this.count}`);
    newLi.children[0].classList.remove("line-throught");
    newLi.children[0].innerText = text;

    if (check) {
      newLi.children[0].classList.add("line-throught");
    }

    newLi.children[3].setAttribute("id", `collapse${this.count}`);
    this.mainList.children[0].appendChild(newLi);

    this.count++;
    this.mainInput.value = "";
  }

  addNewItem(e) {
    e.preventDefault();
    const taskText = this.mainInput.value.trim();

    if (taskText) {
      this.allTasks = JSON.parse(localStorage.getItem("allTasks"));
      const taskExists = this.allTasks.some(item => item.text === taskText);

      if (taskExists) {
        alert("Task Already Added");
      } else {
        this.createNewTask(taskText);
        saveLS(taskText, 1);
      }
    }
  }

  addInnerTask(upperText, mainText, check = false) {
    let tempLi = this.innerLi.cloneNode(true);
    tempLi.setAttribute("id", "");

    tempLi.childNodes.forEach((item, index) => {
      if (index === 3 || index === 5) {
        item.classList.remove("d-none");
      }
    });

    tempLi.children[0].innerText = mainText;

    if (check) {
      tempLi.children[0].classList.add("line-throught");
    }

    const tempList = Array.from(this.mainList.children[0].children)
      .find(child => child.children[0].innerText === upperText);

    if (tempList) {
      tempList.lastElementChild.firstElementChild.firstElementChild.insertBefore(
        tempLi,
        tempList.lastElementChild.firstElementChild.firstElementChild.lastElementChild
      );
    }
  }

  taskStufs(e) {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains("delete-item")) {
      this.deleteMainTask(target);
    } else if (target.classList.contains("delete-inner-item")) {
      this.deleteInnerTask(target);
    } else if (target.classList.contains("check")) {
      this.toggleMainTaskCheck(target);
    } else if (target.classList.contains("inner-check")) {
      this.toggleInnerTaskCheck(target);
    } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
      this.addNewInnerTask(target);
    }
  }

  deleteMainTask(target) {
    const text = target.parentElement.children[0].innerText;
    saveLS(text, 0);

    let tempInnerList = JSON.parse(localStorage.getItem("innerTasks"));
    tempInnerList.forEach(item => {
      if (text === item.upperTaskText) {
        saveInnerTasks(item.mainText, 0, text);
      }
    });

    target.parentElement.remove();
  }

  deleteInnerTask(target) {
    const upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].innerText;
    saveInnerTasks(target.parentElement.children[0].innerText, 0, upperText);
    target.parentElement.remove();
  }

  toggleMainTaskCheck(target) {
    let tmpList = JSON.parse(localStorage.getItem("allTasks"));
    const taskText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-throught");

    const taskIndex = tmpList.findIndex(item => item.text === taskText);
    if (taskIndex !== -1) {
      tmpList[taskIndex].check = isChecked;
      localStorage.setItem("allTasks", JSON.stringify(tmpList));
    }
  }

  toggleInnerTaskCheck(target) {
    let tmp = JSON.parse(localStorage.getItem("innerTasks"));
    const upperText = target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].innerText;
    const innerText = target.parentElement.children[0].innerText;
    const isChecked = target.parentElement.children[0].classList.toggle("line-throught");

    tmp.forEach(item => {
      if (item.mainText === innerText && item.upperTaskText === upperText) {
        item.check = isChecked;
      }
    });

    localStorage.setItem("innerTasks", JSON.stringify(tmp));
  }

  addNewInnerTask(target) {
    const inputElement = target.classList.contains("btn-add-inner-task") 
      ? target.parentElement.childNodes[1] 
      : target.parentElement.parentElement.childNodes[1];

    const text = inputElement.value.trim();
    if (text) {
      const upperText = target.closest('li').children[0].innerText;
      this.innerTasks = JSON.parse(localStorage.getItem("innerTasks"));

      const taskExists = this.innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText);

      if (taskExists) {
        alert("Task Already Added");
      } else {
        const newInnerTask = { upperTaskText: upperText, mainText: text, check: false };
        this.innerTasks.push(newInnerTask);
        this.addInnerTask(upperText, text);
        saveInnerTasks(newInnerTask, 1);
      }
    }
    inputElement.value = "";
  }

  deleteAll(e) {
    e.preventDefault();
    const list = e.target.parentElement.parentElement.children[1].children[0].childNodes[1].children;

    while (list.length > 1) {
      list[list.length - 1].remove();
    }
    saveLS("", -1);
    saveInnerTasks("", -1);
  }
}

export default TaskManager;