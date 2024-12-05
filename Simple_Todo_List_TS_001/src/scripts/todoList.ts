// todoList.ts

import { Task, InnerTask } from './utils';
import { saveLS, saveInnerTasks, loadLS, loadInnerTasks } from './storage';

let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];

let count = 1; // for identical collapse id
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

eventListeners();
loadLS();
loadInnerTasks();

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
  if (check === true) {
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

  if (taskText != "") {
    allTasks = JSON.parse(localStorage.getItem("allTasks") || "[]");
    let c = false;
    allTasks.forEach(function (item) {
      if (item.text == taskText) {
        c = true;
        alert("Task Already Added");
      }
    });
    if (c == false) {
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
  tempLi.childNodes.forEach(function (item, index) {
    if (index == 3 || index == 5) {
      (item as HTMLElement).classList.remove("d-none");
    }
  });
  // to add the value to new li text
  (tempLi.children[0] as HTMLElement).innerText = mainText;

  // check
  if (check == true) {
    tempLi.children[0].classList.add("line-throught");
  } else {
    tempLi.children[0].classList.remove("line-throught");
  }

  // adding new inner task to last of the list before form
  let tempList: HTMLElement | null = null;
  for (let i = 1; i < mainList.children[0].children.length; i++) {
    if (upperText == (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
      tempList = mainList.children[0].children[i] as HTMLElement;
      break;
    }
  }

  // adding inner to upper
  if (tempList) {
    tempList.lastElementChild!.firstElementChild!.firstElementChild!.insertBefore(
      tempLi,
      tempList.lastElementChild!.firstElementChild!.firstElementChild!.lastElementChild
    );
  }
}

// delete and check a task - add new inner task
function taskStufs(e: Event): void {
  e.preventDefault();
  const target = e.target as HTMLElement;

  // delete item
  if (target.classList.contains("delete-item")) {
    // remove LS
    const text = (target.parentElement!.children[0] as HTMLElement).innerText;
    saveLS(text, 0);

    // remove inner tasks of it
    let tempInnerList: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

    tempInnerList.forEach(function (item) {
      if (text == item.upperTaskText) {
        saveInnerTasks(item.mainText, 0, text);
      }
    });

    // remove from page
    target.parentElement!.remove();

    // to check an inner task
  } else if (target.classList.contains("delete-inner-item")) {
    const upperText = (target.parentElement!.parentElement!.parentElement!.parentElement!
      .parentElement!.children[0] as HTMLElement).innerText;
    // removing LS
    saveInnerTasks((target.parentElement!.children[0] as HTMLElement).innerText, 0, upperText);

    // Removing Page
    target.parentElement!.remove();
  } else if (target.classList.contains("check")) {
    let tmpList: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");

    if (target.parentElement!.children[0].classList.contains("line-throught")) {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text == (target.parentElement!.children[0] as HTMLElement).innerText) {
          tmpList[i].check = false;
          localStorage.setItem("allTasks", JSON.stringify(tmpList));
          break;
        }
      }

      target.parentElement!.children[0].classList.remove("line-throught");
    } else {
      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].text == (target.parentElement!.children[0] as HTMLElement).innerText) {
          tmpList[i].check = true;
          localStorage.setItem("allTasks", JSON.stringify(tmpList));
          break;
        }
      }

      target.parentElement!.children[0].classList.add("line-throught");
    }

    // adding inner task with button
  } else if (target.classList.contains("inner-check")) {
    let tmp: InnerTask[] = JSON.parse(localStorage.getItem("innerTasks") || "[]");

    const upperText = (target.parentElement!.parentElement!.parentElement!.parentElement!
      .parentElement!.children[0] as HTMLElement).innerText;

    if (target.parentElement!.children[0].classList.contains("line-throught")) {
      tmp.forEach(function (item) {
        if (
          item.mainText == (target.parentElement!.children[0] as HTMLElement).innerText &&
          item.upperTaskText == upperText
        ) {
          item.check = false;
          localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
      });
      target.parentElement!.children[0].classList.remove("line-throught");
    } else {
      tmp.forEach(function (item) {
        if (
          item.mainText == (target.parentElement!.children[0] as HTMLElement).innerText &&
          item.upperTaskText == upperText
        ) {
          item.check = true;
          localStorage.setItem("innerTasks", JSON.stringify(tmp));
        }
      });
      target.parentElement!.children[0].classList.add("line-throught");
    }
  } else if (target.classList.contains("btn-add-inner-task")) {
    // getting value of input
    const text = (target.parentElement!.childNodes[1] as HTMLInputElement).value;

    if (text != "") {
      innerTasks = JSON.parse(localStorage.getItem("innerTasks") || "[]");

      // getting upper text
      const upperText = (target.parentElement!.parentElement!.parentElement!.parentElement!
        .parentElement!.parentElement!.children[0] as HTMLElement).innerText;

      let c = true;
      innerTasks.forEach(function (item) {
        if (item.mainText == text && item.upperTaskText == upperText) {
          c = false;
          alert("Task Already Added");
        }
      });
      if (c == true) {
        // adding innerTask List
        innerTasks.push({
          upperTaskText: upperText,
          mainText: text,
          check: false,
        });
        addInnerTask(upperText, text, false);
        saveInnerTasks(innerTasks[innerTasks.length - 1], 1);
      }
    }
    // clear input
    (target.parentElement!.childNodes[1] as HTMLInputElement).value = "";

    // adding inner task with i tag that in the button
    // same things with adding with btn
  } else if (target.classList.contains("i-add-inner-task")) {
    let text = (target.parentElement!.parentElement!.childNodes[1] as HTMLInputElement).value;

    if (text != "") {
      // getting upper text
      const upperText = (target.parentElement!.parentElement!.parentElement!.parentElement!
        .parentElement!.parentElement!.parentElement!.children[0] as HTMLElement).innerText;

      // adding innerTask List
      innerTasks.push({ upperTaskText: upperText, mainText: text, check: false });

      addInnerTask(upperText, text, false);
      saveInnerTasks(innerTasks[innerTasks.length - 1], 1);

      // clear input
      (target.parentElement!.parentElement!.childNodes[1] as HTMLInputElement).value = "";
    }
  }
}

// delete all
function deleteAll(e: Event): void {
  e.preventDefault();

  let list = (e.target as HTMLElement).parentElement!.parentElement!.children[1].children[0].childNodes[1]
    .children;

  while (list.length != 1) {
    // block the remove main invisible li in html
    list[list.length - 1].remove();
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

export { eventListeners, createNewTask, addNewItem, addInnerTask, taskStufs, deleteAll };