import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

// Mock DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <ul id="mainList">
      <li id="upperLi" class="d-none">
        <a href="#"></a>
        <span></span>
        <i></i>
        <div></div>
      </li>
    </ul>
    <li id="innerLi" class="d-none">
      <span></span>
      <i class="d-none"></i>
      <i class="d-none"></i>
    </li>
    <form id="addingForm">
      <input type="text" />
    </form>
    <button id="delAll"></button>
  </body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Types
interface Task {
  text: string;
  check: boolean;
}

interface InnerTask {
  upperTaskText: string;
  mainText: string;
  check: boolean;
}

// Utility functions
function saveToLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// Main code
let allTasks: Task[] = [];
let innerTasks: InnerTask[] = [];

let count = 1;
const upperLi = document.getElementById("upperLi") as HTMLLIElement;
const innerLi = document.getElementById("innerLi") as HTMLLIElement;
const mainForm = document.getElementById("addingForm") as HTMLFormElement;
const mainInput = mainForm.children[0] as HTMLInputElement;
const mainList = document.getElementById("mainList") as HTMLUListElement;
const delAll = document.getElementById("delAll") as HTMLButtonElement;

function eventListeners(): void {
  mainForm.addEventListener("submit", addNewItem);
  mainList.addEventListener("click", taskStufs);
  delAll.addEventListener("click", deleteAll);
}

function createNewTask(text: string, check: boolean): void {
  const newLi = upperLi.cloneNode(true) as HTMLLIElement;
  newLi.classList.remove("d-none");
  newLi.setAttribute("id", "");

  const anchor = newLi.children[0] as HTMLAnchorElement;
  anchor.setAttribute("href", `#collapse${count}`);
  anchor.classList.remove("line-throught");
  anchor.innerText = text;
  
  if (check) {
    anchor.classList.add("line-throught");
  }
  
  newLi.children[3].setAttribute("id", `collapse${count}`);
  mainList.children[0].appendChild(newLi);
  count++;
  mainInput.value = "";
}

function addNewItem(e: Event): void {
  e.preventDefault();
  const taskText = mainInput.value;

  if (taskText !== "") {
    allTasks = loadFromLocalStorage<Task[]>("allTasks") || [];
    if (!allTasks.some(item => item.text === taskText)) {
      createNewTask(taskText, false);
      saveLS(taskText, 1);
    } else {
      alert("Task Already Added");
    }
  }
}

function addInnerTask(upperText: string, mainText: string, check: boolean): void {
  let tempLi = innerLi.cloneNode(true) as HTMLLIElement;
  tempLi.setAttribute("id", "");

  tempLi.childNodes.forEach((item, index) => {
    if (index === 3 || index === 5) {
      (item as HTMLElement).classList.remove("d-none");
    }
  });

  (tempLi.children[0] as HTMLElement).innerText = mainText;

  if (check) {
    tempLi.children[0].classList.add("line-throught");
  }

  let tempList: HTMLElement | null = null;
  for (let i = 1; i < mainList.children[0].children.length; i++) {
    if (upperText === (mainList.children[0].children[i].children[0] as HTMLElement).innerText) {
      tempList = mainList.children[0].children[i] as HTMLElement;
      break;
    }
  }

  if (tempList) {
    const innerList = tempList.lastElementChild?.firstElementChild?.firstElementChild as HTMLElement;
    innerList.insertBefore(tempLi, innerList.lastElementChild);
  }
}

function taskStufs(e: Event): void {
  e.preventDefault();
  const target = e.target as HTMLElement;

  if (target.classList.contains("delete-item")) {
    const text = (target.parentElement?.children[0] as HTMLElement).innerText;
    saveLS(text, 0);
    let tempInnerList = loadFromLocalStorage<InnerTask[]>("innerTasks") || [];
    tempInnerList.forEach(item => {
      if (text === item.upperTaskText) {
        saveInnerTasks(item.mainText, 0, text);
      }
    });
    target.parentElement?.remove();
  } else if (target.classList.contains("delete-inner-item")) {
    const upperText = (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText;
    saveInnerTasks((target.parentElement?.children[0] as HTMLElement).innerText, 0, upperText);
    target.parentElement?.remove();
  } else if (target.classList.contains("check") || target.classList.contains("inner-check")) {
    const isInnerTask = target.classList.contains("inner-check");
    const taskList = isInnerTask ? loadFromLocalStorage<InnerTask[]>("innerTasks") : loadFromLocalStorage<Task[]>("allTasks");
    const taskElement = target.parentElement?.children[0] as HTMLElement;
    const upperText = isInnerTask ? (target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement).innerText : "";

    if (taskList) {
      const updatedTaskList = taskList.map(task => {
        if ((isInnerTask && task.mainText === taskElement.innerText && (task as InnerTask).upperTaskText === upperText) ||
            (!isInnerTask && task.text === taskElement.innerText)) {
          return { ...task, check: !task.check };
        }
        return task;
      });

      saveToLocalStorage(isInnerTask ? "innerTasks" : "allTasks", updatedTaskList);
      taskElement.classList.toggle("line-throught");
    }
  } else if (target.classList.contains("btn-add-inner-task") || target.classList.contains("i-add-inner-task")) {
    const inputElement = target.classList.contains("btn-add-inner-task") 
      ? target.parentElement?.childNodes[1] as HTMLInputElement
      : target.parentElement?.parentElement?.childNodes[1] as HTMLInputElement;
    
    const text = inputElement.value;

    if (text !== "") {
      innerTasks = loadFromLocalStorage<InnerTask[]>("innerTasks") || [];
      const upperText = (target.closest('li')?.children[0] as HTMLElement).innerText;

      if (!innerTasks.some(item => item.mainText === text && item.upperTaskText === upperText)) {
        const newInnerTask: InnerTask = { upperTaskText: upperText, mainText: text, check: false };
        addInnerTask(upperText, text, false);
        saveInnerTasks(newInnerTask, 1);
      } else {
        alert("Task Already Added");
      }
    }
    inputElement.value = "";
  }
}

function deleteAll(e: Event): void {
  e.preventDefault();
  const list = mainList.children[0].children;
  while (list.length > 1) {
    list[list.length - 1].remove();
  }
  saveLS("", -1);
  saveInnerTasks("", -1);
}

function loadLS(): void {
  allTasks = loadFromLocalStorage<Task[]>("allTasks") || [];
  allTasks.forEach(item => {
    if (item.text !== "") {
      createNewTask(item.text, item.check);
    }
  });
}

function loadInnerTasks(): void {
  innerTasks = loadFromLocalStorage<InnerTask[]>("innerTasks") || [];
  innerTasks.forEach(item => {
    if (item.mainText !== "") {
      addInnerTask(item.upperTaskText, item.mainText, item.check);
    }
  });
}

function saveLS(text: string, index: number): void {
  if (index === -1) {
    localStorage.removeItem("allTasks");
    allTasks = [];
    loadLS();
  } else if (index === 0) {
    allTasks = allTasks.filter(item => item.text !== text);
    saveToLocalStorage("allTasks", allTasks);
    const innerTasksToRemove = innerTasks.filter(item => item.upperTaskText === text);
    innerTasksToRemove.forEach(item => saveInnerTasks(item.mainText, 0, text));
  } else if (index === 1) {
    allTasks.push({ text, check: false });
    saveToLocalStorage("allTasks", allTasks);
  }
}

function saveInnerTasks(item: string | InnerTask, index: number, upperText: string = ""): void {
  if (index === -1) {
    localStorage.removeItem("innerTasks");
    innerTasks = [];
    loadInnerTasks();
  } else if (index === 0) {
    innerTasks = innerTasks.filter(task => 
      !(typeof item === 'string' && task.mainText === item && task.upperTaskText === upperText)
    );
    saveToLocalStorage("innerTasks", innerTasks);
  } else if (index === 1 && typeof item !== 'string') {
    innerTasks.push(item);
    saveToLocalStorage("innerTasks", innerTasks);
  }
}

// Tests
describe('Task Management Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    allTasks = [];
    innerTasks = [];
    count = 1;
    document.body.innerHTML = dom.window.document.body.innerHTML;
  });

  it('should create a new task', () => {
    createNewTask('Test Task', false);
    expect(mainList.children[0].children.length).to.equal(2);
    expect((mainList.children[0].lastElementChild?.children[0] as HTMLElement).innerText).to.equal('Test Task');
  });

  it('should add a new item', () => {
    mainInput.value = 'New Task';
    addNewItem(new Event('submit'));
    expect(allTasks.length).to.equal(1);
    expect(allTasks[0].text).to.equal('New Task');
  });

  it('should add an inner task', () => {
    createNewTask('Main Task', false);
    addInnerTask('Main Task', 'Inner Task', false);
    const mainTaskElement = mainList.children[0].children[1] as HTMLElement;
    const innerTaskList = mainTaskElement.querySelector('.inner-task-list') as HTMLElement;
    expect(innerTaskList.children.length).to.equal(2); // Including the form
    expect((innerTaskList.firstElementChild as HTMLElement).innerText).to.equal('Inner Task');
  });

  it('should delete a task', () => {
    createNewTask('Task to Delete', false);
    const deleteButton = mainList.querySelector('.delete-item') as HTMLElement;
    taskStufs(new MouseEvent('click', { bubbles: true }));
    expect(mainList.children[0].children.length).to.equal(1);
  });

  it('should delete all tasks', () => {
    createNewTask('Task 1', false);
    createNewTask('Task 2', false);
    deleteAll(new Event('click'));
    expect(mainList.children[0].children.length).to.equal(1);
    expect(allTasks.length).to.equal(0);
  });

  it('should load tasks from local storage', () => {
    saveToLocalStorage('allTasks', [{ text: 'Stored Task', check: false }]);
    loadLS();
    expect(mainList.children[0].children.length).to.equal(2);
    expect((mainList.children[0].lastElementChild?.children[0] as HTMLElement).innerText).to.equal('Stored Task');
  });

  it('should load inner tasks from local storage', () => {
    createNewTask('Main Task', false);
    saveToLocalStorage('innerTasks', [{ upperTaskText: 'Main Task', mainText: 'Stored Inner Task', check: false }]);
    loadInnerTasks();
    const mainTaskElement = mainList.children[0].children[1] as HTMLElement;
    const innerTaskList = mainTaskElement.querySelector('.inner-task-list') as HTMLElement;
    expect(innerTaskList.children.length).to.equal(2);
    expect((innerTaskList.firstElementChild as HTMLElement).innerText).to.equal('Stored Inner Task');
  });
});

// Run the tests
mocha.run();